
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    get_products,
    get_product,
    CartViewSet,
    AddressViewSet,
    WishlistViewSet,
    create_payment,
    verify_payment,
    get_orders,
    cancel_order,
    download_invoice,

    # REVIEWS
    get_product_reviews,
    add_review,
    update_review,
    delete_review,
    mark_helpful,
)

# =========================
# ROUTERS
# =========================
router = DefaultRouter()
router.register(r'cart', CartViewSet, basename="cart")
router.register(r'addresses', AddressViewSet, basename="addresses")
router.register(r'wishlist', WishlistViewSet, basename="wishlist")

# =========================
# URL PATTERNS
# =========================
urlpatterns = [

    # =========================
    # PRODUCTS
    # =========================
    path('products/', get_products),
    path('products/<int:product_id>/', get_product),

    # =========================
    # CART / ADDRESS / WISHLIST
    # =========================
    path('', include(router.urls)),

    # =========================
    # PAYMENT
    # =========================
    path('create-payment/', create_payment),
    path('verify-payment/', verify_payment),

    # =========================
    # ORDERS
    # =========================
    path('orders/', get_orders),
    path('cancel-order/<int:order_id>/', cancel_order),
    path('download-invoice/<int:order_id>/', download_invoice),

    # =========================
    # REVIEWS ⭐ FINAL
    # =========================
    # REVIEWS
    path(
       "products/<int:product_id>/reviews/",
        get_product_reviews
    ),

    path(
       "products/<int:product_id>/reviews/add/",
        add_review
    ),

    path(
       "reviews/<int:review_id>/update/",
        update_review
   ),

    path(
        "reviews/<int:review_id>/delete/",
        delete_review
    ),

    path(
        "reviews/<int:review_id>/helpful/",
        mark_helpful
    ),
]