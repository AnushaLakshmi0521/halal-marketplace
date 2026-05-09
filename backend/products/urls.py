from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    get_products,
    CartViewSet,
    create_payment,
    verify_payment,
    get_orders   # ✅ ADDED
)

router = DefaultRouter()
router.register(r'cart', CartViewSet, basename="cart")

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
]