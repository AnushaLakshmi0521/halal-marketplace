from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    get_products,
    CartViewSet,
    AddressViewSet,
    WishlistViewSet,
    create_payment,
    verify_payment,
    get_orders,
    cancel_order
    
)

router = DefaultRouter()
router.register(r'cart', CartViewSet, basename="cart")
router.register(
    r'addresses',
    AddressViewSet,
    basename="addresses"
)
router.register(
    r'wishlist',
    WishlistViewSet,
    basename='wishlist'
)
urlpatterns = [
    # =========================
    # PRODUCTS
    # =========================
    path('products/', get_products),

    # =========================
    # CART
    # =========================
    path('', include(router.urls)),

    # =========================
    # PAYMENT
    # =========================
    path('create-payment/', create_payment),
    path('verify-payment/', verify_payment),

    # =========================
    # ORDERS (NEW)
    # =========================
    path('orders/', get_orders),
    path(
        'cancel-order/<int:order_id>/',
        cancel_order
    ),
]