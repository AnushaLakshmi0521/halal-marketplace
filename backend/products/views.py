from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from reportlab.pdfgen import canvas
from django.http import HttpResponse

from .models import (
    Product,
    CartItem,
    Order,
    OrderItem,
    Address,
    WishlistItem,
  
)
from .serializers import (
    CartItemSerializer,
    AddressSerializer,
    WishlistSerializer
)

import razorpay


# =========================
# AUTH (SIGNUP)
# =========================
@api_view(['POST'])
def signup(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response({"error": "Username and password required"}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"error": "User already exists"}, status=400)

    user = User.objects.create_user(username=username, password=password)
    return Response({"message": "Signup successful"})


# =========================
# AUTH (LOGIN - JWT)
# =========================
@api_view(['POST'])
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)

    if user is None:
        return Response({"error": "Invalid credentials"}, status=400)

    refresh = RefreshToken.for_user(user)

    return Response({
        "username": user.username,
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    })


# =========================
# PRODUCTS API
# =========================
@api_view(['GET'])
def get_products(request):
    products = Product.objects.all()

    data = []
    for p in products:
        data.append({
            "id": p.id,
            "name": p.name,
            "price": p.price,
            "description": p.description,
            "halal_certified": p.halal_certified,
            "ingredients": p.ingredients,
            "source": p.source,
            "category": p.category, 
            "stock_quantity": p.stock_quantity,

            "stock_status": (
               "out_of_stock"
               if p.stock_quantity <= 0
               else "low_stock"
               if p.stock_quantity <= 3
               else "in_stock"
            ),

            "stock_left": p.stock_quantity,
            #"estimated_delivery": order.estimated_delivery,
            "image": p.image.url if p.image else None
        })

    return Response(data)


# =========================
# CART API
# =========================
class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):

        product_id = request.data.get("product")
        quantity = int(request.data.get("quantity", 1))
        if quantity <= 0:
               return Response(
                   {"error": "Invalid quantity"},
                   status=400
                )

        try:
            product = Product.objects.get(id=product_id)

        except Product.DoesNotExist:
            return Response(
                {"error": "Product not found"},
                status=404
            )

        # OUT OF STOCK
        if product.stock_quantity <= 0:
            return Response(
                {"error": "Product is out of stock"},
                status=400
            )

        existing_item = CartItem.objects.filter(
            user=request.user,
            product_id=product_id
        ).first()

        if existing_item:

            if (
                existing_item.quantity + quantity
                > product.stock_quantity
            ):
                return Response(
                    {
                        "error":
                        f"Only {product.stock_quantity} items available"
                    },
                    status=400
                )

            existing_item.quantity += quantity
            existing_item.save()

            serializer = self.get_serializer(
                existing_item
            )

            return Response(serializer.data)

        return super().create(
            request,
            *args,
            **kwargs
        )
# =========================
# ADDRESS API
# =========================
class AddressViewSet(viewsets.ModelViewSet):

    serializer_class = AddressSerializer

    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(
            user=self.request.user
        ).order_by('-created_at')

    def perform_create(self, serializer):

        # Remove old default address
        if serializer.validated_data.get("is_default"):

            Address.objects.filter(
                user=self.request.user,
                is_default=True
            ).update(is_default=False)

        serializer.save(user=self.request.user)

    def perform_update(self, serializer):

        # Remove old default address
        if serializer.validated_data.get("is_default"):

            Address.objects.filter(
                user=self.request.user,
                is_default=True
            ).exclude(
                id=self.get_object().id
            ).update(is_default=False)

        serializer.save()


# =========================
# CREATE PAYMENT (RAZORPAY)
# =========================
@api_view(['POST'])
def create_payment(request):
    client = razorpay.Client(auth=(
        "rzp_test_SjDC6PR531fZZw",
        "GyVS1QmpMUWFBG1dsYEZl5Il"
    ))

    amount = request.data.get("amount", 50000)

    order = client.order.create({
        "amount": amount,
        "currency": "INR",
        "payment_capture": 1
    })

    return Response(order)


# =========================
# VERIFY PAYMENT + CREATE ORDER
# =========================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_payment(request):
    client = razorpay.Client(auth=(
        "rzp_test_SjDC6PR531fZZw",
        "GyVS1QmpMUWFBG1dsYEZl5Il"
    ))

    data = request.data
    user = request.user

    try:
        # ✅ VERIFY PAYMENT
        client.utility.verify_payment_signature({
            "razorpay_order_id": data.get("razorpay_order_id"),
            "razorpay_payment_id": data.get("razorpay_payment_id"),
            "razorpay_signature": data.get("razorpay_signature"),
        })

        # ✅ GET USER CART
        cart_items = CartItem.objects.filter(user=user)
        for item in cart_items:

            if item.quantity > item.product.stock_quantity:

                return Response(
                {
                   "error":
                   f"{item.product.name} has only {item.product.stock_quantity} items left"
                },
                status=400
                )

        if not cart_items.exists():
            return Response({"error": "Cart is empty"}, status=400)

        # ✅ CALCULATE TOTAL
        total = sum(
            item.product.price * item.quantity
            for item in cart_items
        )

        # ✅ CREATE ORDER
        # ✅ CREATE ORDER
        order = Order.objects.create(
            user=user,
            name=data.get("name"),
            address=data.get("address"),
            phone=data.get("phone"),

            total_amount=total,

            payment_id=data.get("razorpay_payment_id"),

            payment_method="Razorpay",

            payment_status="Paid",

            shipping_charge=0,

            status="Placed"
      )

        # ✅ CREATE ORDER ITEMS
        for item in cart_items:

           OrderItem.objects.create(
            order=order,
            product=item.product,
            quantity=item.quantity,
            price=item.product.price
           )

           item.product.stock_quantity -= item.quantity
           item.product.save()

        # ✅ CLEAR ONLY THIS USER CART
        cart_items.delete()

        return Response({
            "message": "Order placed successfully",
            "order_id": order.id
        })

    except Exception as e:
        return Response(
            {"error": "Payment verification failed", "details": str(e)},
            status=400
        )
    
# =========================
# GET USER ORDERS
# =========================
# =========================
# GET USER ORDERS
# =========================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_orders(request):

    user = request.user

    orders = Order.objects.filter(
        user=user
    ).order_by('-created_at')

    data = []

    for order in orders:
        order.update_cancel_status()

        items = []

        for item in order.items.all():

            items.append({
                "name": item.product.name,
                "price": item.price,
                "quantity": item.quantity,
                "image": item.product.image.url if item.product.image else None
            })

        data.append({

            "id": order.id,
            "can_cancel": order.can_cancel,

            "name": order.name,

            "address": order.address,

            "phone": order.phone,

            "total_amount": order.total_amount,

            "status": order.status,

            "tracking_id": order.tracking_id,

            "estimated_delivery": order.estimated_delivery,

            "created_at": order.created_at,

            # ✅ TRACKING TIMES
            "packed_at": order.packed_at,

            "shipped_at": order.shipped_at,

            "out_for_delivery_at": order.out_for_delivery_at,

            "delivered_at": order.delivered_at,

            "cancelled_at": order.cancelled_at,

            "items": items
        })

    return Response(data)

class WishlistViewSet(viewsets.ModelViewSet):

    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return WishlistItem.objects.filter(
            user=self.request.user
        )

    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user
        )

    def create(self, request, *args, **kwargs):

        product_id = request.data.get("product")

        existing = WishlistItem.objects.filter(
            user=request.user,
            product_id=product_id
        ).first()

        if existing:
            return Response(
                {"message": "Already in wishlist"}
            )

        return super().create(
            request,
            *args,
            **kwargs
        )
    
from django.utils import timezone
from datetime import timedelta

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def cancel_order(request, order_id):

    try:
        order = Order.objects.get(
            id=order_id,
            user=request.user
        )

        # 30 second check
        if timezone.now() > order.created_at + timedelta(seconds=30):
            return Response(
                {"error": "Cancellation time expired"},
                status=400
            )

        order.status = "Cancelled"
        order.can_cancel = False
        order.save()

        return Response({
            "message": "Order cancelled successfully"
        })

    except Order.DoesNotExist:
        return Response(
            {"error": "Order not found"},
            status=404
        )


@api_view(["GET"])
def download_invoice(request, order_id):

    from django.utils import timezone

    order = Order.objects.get(id=order_id)

    invoice_no = (
        f"HT-{order.created_at.year}-"
        f"{str(order.id).zfill(6)}"
    )

    invoice_date = timezone.now().strftime(
        "%d-%b-%Y"
    )

    order_date = order.created_at.strftime(
        "%d-%b-%Y"
    )

    response = HttpResponse(
        content_type="application/pdf"
    )

    response["Content-Disposition"] = (
        f'attachment; filename="invoice_{order.id}.pdf"'
    )

    p = canvas.Canvas(response)

    # =========================
    # HEADER
    # =========================

    p.setFont("Helvetica-Bold", 18)
    p.drawString(50, 800, "HAL TAYYIB")

    p.setFont("Helvetica", 10)
    p.drawString(
        50,
        785,
        "Quality You Can Trust"
    )

    p.line(50, 775, 550, 775)

    # =========================
    # INVOICE INFO
    # =========================

    p.setFont("Helvetica-Bold", 12)

    p.drawString(
        50,
        745,
        f"Invoice No: {invoice_no}"
    )

    p.setFont("Helvetica", 11)

    p.drawString(
        50,
        725,
        f"Invoice Date: {invoice_date}"
    )

    p.drawString(
        300,
        725,
        f"Order Date: {order_date}"
    )

    # =========================
    # CUSTOMER INFO
    # =========================

    p.setFont("Helvetica-Bold", 12)

    p.drawString(
        50,
        690,
        "Customer Information"
    )

    p.setFont("Helvetica", 11)

    p.drawString(
        50,
        670,
        f"Name: {order.name}"
    )

    p.drawString(
        50,
        650,
        f"Phone: {order.phone}"
    )

    p.drawString(
        50,
        630,
        f"Address: {str(order.address)[:70]}"
    )

    # =========================
    # PAYMENT INFO
    # =========================

    p.setFont("Helvetica-Bold", 12)

    p.drawString(
        50,
        595,
        "Payment Information"
    )

    p.setFont("Helvetica", 11)

    p.drawString(
        50,
        575,
        f"Payment Method: {order.payment_method}"
    )

    p.drawString(
        300,
        575,
        f"Payment Status: {order.payment_status}"
    )

    if order.payment_id:
        p.drawString(
            50,
            555,
            f"Payment ID: {order.payment_id}"
        )

    # =========================
    # PRODUCT TABLE
    # =========================

    y = 510

    p.setFont("Helvetica-Bold", 11)

    p.drawString(50, y, "Product")
    p.drawString(300, y, "Qty")
    p.drawString(360, y, "Price")
    p.drawString(460, y, "Total")

    y -= 10

    p.line(50, y, 550, y)

    subtotal = 0

    for item in order.items.all():

        y -= 25

        item_total = (
            item.price *
            item.quantity
        )

        subtotal += item_total

        p.setFont("Helvetica", 10)

        p.drawString(
            50,
            y,
            str(item.product.name)[:30]
        )

        p.drawString(
            300,
            y,
            str(item.quantity)
        )

        p.drawString(
            360,
            y,
            f"₹{item.price}"
        )

        p.drawString(
            460,
            y,
            f"₹{item_total}"
        )

    # =========================
    # TOTALS
    # =========================

    y -= 40

    p.line(
        300,
        y + 25,
        550,
        y + 25
    )

    p.setFont("Helvetica", 11)

    p.drawString(
        350,
        y,
        f"Subtotal: ₹{subtotal}"
    )

    y -= 20

    p.drawString(
        350,
        y,
        f"Shipping: ₹{order.shipping_charge}"
    )

    y -= 20

    grand_total = (
        subtotal +
        order.shipping_charge
    )

    p.setFont("Helvetica-Bold", 12)

    p.drawString(
        350,
        y,
        f"Grand Total: ₹{grand_total}"
    )

    # =========================
    # ORDER INFO
    # =========================

    y -= 50

    p.setFont("Helvetica-Bold", 11)

    p.drawString(
        50,
        y,
        "Order Information"
    )

    y -= 20

    p.setFont("Helvetica", 10)

    p.drawString(
        50,
        y,
        f"Order Status: {order.status}"
    )

    y -= 20

    p.drawString(
        50,
        y,
        f"Tracking ID: {order.tracking_id or 'Not Assigned'}"
    )

    # =========================
    # FOOTER
    # =========================

    y -= 60

    p.line(
        50,
        y + 20,
        550,
        y + 20
    )

    p.setFont(
        "Helvetica-Bold",
        11
    )

    p.drawString(
        50,
        y,
        "Thank you for shopping with HAL TAYYIB!"
    )

    y -= 30

    p.setFont(
        "Helvetica",
        9
    )

    p.drawString(
        50,
        y,
        "Terms & Conditions:"
    )

    y -= 15

    p.drawString(
        60,
        y,
        "• Keep this invoice for future reference."
    )

    y -= 15

    p.drawString(
        60,
        y,
        "• Refunds are subject to company policy."
    )

    y -= 15

    p.drawString(
        60,
        y,
        "• Contact support for assistance."
    )

    p.save()

    return response