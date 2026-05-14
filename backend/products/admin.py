
from django.contrib import admin

from .models import (
    Product,
    CartItem,
    Order,
    OrderItem
)


# =========================
# PRODUCT ADMIN
# =========================
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "name",
        "price",
        "category",
        "halal_certified",
    )

    list_filter = (
        "category",
        "halal_certified",
    )

    search_fields = (
        "name",
        "category",
    )


# =========================
# CART ADMIN
# =========================
@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "user",
        "product",
        "quantity",
    )

    search_fields = (
        "user__username",
        "product__name",
    )


# =========================
# ORDER ITEMS INLINE
# =========================
class OrderItemInline(admin.TabularInline):

    model = OrderItem

    extra = 0

    readonly_fields = (
        "product",
        "quantity",
        "price",
    )


# =========================
# ORDER ADMIN
# =========================
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "user",
        "name",
        "phone",
        "status",
        "payment_status",
        "total_amount",
        "tracking_id",
        "estimated_delivery",
        "created_at",
    )

    list_filter = (
        "status",
        "payment_status",
        "created_at",
    )

    search_fields = (
        "user__username",
        "name",
        "phone",
        "tracking_id",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
        "delivered_at",
        "cancelled_at",
    )

    inlines = [OrderItemInline]

    fieldsets = (

        ("Customer Information", {
            "fields": (
                "user",
                "name",
                "phone",
                "address",
            )
        }),

        ("Payment Information", {
            "fields": (
                "payment_id",
                "payment_status",
                "total_amount",
            )
        }),

        ("Order Tracking", {
            "fields": (
                "status",
                "tracking_id",
                "estimated_delivery",
            )
        }),

        ("Timestamps", {
            "fields": (
                "created_at",
                "updated_at",
                "delivered_at",
                "cancelled_at",
            )
        }),

    )


# =========================
# ORDER ITEM ADMIN
# =========================
@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "order",
        "product",
        "quantity",
        "price",
    )

    search_fields = (
        "product__name",
    )