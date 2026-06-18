
from rest_framework import serializers

from .models import (
    Product,
    CartItem,
    Order,
    OrderItem,
    Address,
    WishlistItem,
    Review,
    
)


# =========================
# PRODUCTS
# =========================
class ProductSerializer(serializers.ModelSerializer):

    stock_status = serializers.SerializerMethodField()
    stock_left = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = "__all__"

    def get_stock_status(self, obj):

        if obj.stock_quantity <= 0:
            return "out_of_stock"

        elif obj.stock_quantity <= 3:
            return "low_stock"

        return "in_stock"

    def get_stock_left(self, obj):
        return obj.stock_quantity

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

        try:
            if obj.product.image:
                return obj.product.image.build_url()

        except:
            pass

        return "https://via.placeholder.com/100"

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

            "packed_at",
            "shipped_at",
            "out_for_delivery_at",

            "delivered_at",
            "cancelled_at",

            "items",
        ]
# =========================
# ADDRESS
# =========================
class AddressSerializer(serializers.ModelSerializer):

    class Meta:
        model = Address

        fields = [
            "id",
            "user",

            "full_name",
            "phone",

            "address_line",
            "city",
            "state",
            "pincode",

            "is_default",

            "created_at",
        ]

        read_only_fields = [
            "user"
        ]
class WishlistSerializer(serializers.ModelSerializer):

    product_detail = ProductSerializer(
        source="product",
        read_only=True
    )

    class Meta:
        model = WishlistItem
        fields = [
            "id",
            "product",
            "product_detail",
            "created_at"
        ]

class ReviewSerializer(serializers.ModelSerializer):

    username = serializers.CharField(source="user.username", read_only=True)
    user_id = serializers.IntegerField(source="user.id",read_only=True)

    class Meta:
        model = Review
        fields = [
            "id",
            "user_id",
            "username",
            "rating",
            "comment",
            "image",
            "helpful_count",
            "is_verified_buyer",
            "created_at",
            "product"
        ]

        read_only_fields = ["user", "created_at"]