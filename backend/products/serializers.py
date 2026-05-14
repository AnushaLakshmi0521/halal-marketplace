
from rest_framework import serializers
from .models import Product, CartItem, Order, OrderItem


# =========================
# PRODUCTS
# =========================
class ProductSerializer(serializers.ModelSerializer):

    class Meta:
        model = Product
        fields = "__all__"


# =========================
# CART
# =========================
class CartItemSerializer(serializers.ModelSerializer):

    product_detail = ProductSerializer(
        source="product",
        read_only=True
    )

    class Meta:
        model = CartItem
        fields = [
            "id",
            "product",
            "quantity",
            "product_detail"
        ]


# =========================
# ORDER ITEMS
# =========================
class OrderItemSerializer(serializers.ModelSerializer):

    product_name = serializers.CharField(
        source="product.name",
        read_only=True
    )

    product_image = serializers.SerializerMethodField()

    def get_product_image(self, obj):
        if obj.product.image:
            return obj.product.image.url
        return None

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product_name",
            "product_image",
            "quantity",
            "price",
        ]


# =========================
# ORDERS
# =========================
class OrderSerializer(serializers.ModelSerializer):

    items = OrderItemSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Order

        fields = [
            "id",
            "user",

            "name",
            "address",
            "phone",

            "payment_id",
            "payment_status",

            "status",

            "tracking_id",
            "estimated_delivery",

            "total_amount",

            "created_at",
            "updated_at",
            "delivered_at",
            "cancelled_at",

            "items",
        ]