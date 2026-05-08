from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Product, CartItem, Order, OrderItem
from .serializers import CartItemSerializer

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

        existing_item = CartItem.objects.filter(
            user=request.user,
            product_id=product_id
        ).first()

        if existing_item:
            existing_item.quantity += quantity
            existing_item.save()

            serializer = self.get_serializer(existing_item)
            return Response(serializer.data)

        return super().create(request, *args, **kwargs)


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

        if not cart_items.exists():
            return Response({"error": "Cart is empty"}, status=400)

        # ✅ CALCULATE TOTAL
        total = sum(
            item.product.price * item.quantity
            for item in cart_items
        )

        # ✅ CREATE ORDER
        order = Order.objects.create(
            user=user,
            name=data.get("name"),
            address=data.get("address"),
            phone=data.get("phone"),
            total_amount=total,
            payment_id=data.get("razorpay_payment_id"),
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
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_orders(request):
    user = request.user

    orders = Order.objects.filter(user=user).order_by('-created_at')

    data = []

    for order in orders:
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
            "name": order.name,
            "address": order.address,
            "phone": order.phone,
            "total_amount": order.total_amount,
            "status": order.status,
            "created_at": order.created_at,
            "items": items
        })

    return Response(data)