
from django.db import models
from cloudinary.models import CloudinaryField
from django.contrib.auth.models import User


# =========================
# PRODUCT MODEL
# =========================
class Product(models.Model):
    CATEGORY_CHOICES = [
        ("Ethical Meats", "Ethical Meats"),
        ("Fresh Organics", "Fresh Organics"),
        ("Pantry Essentials", "Pantry Essentials"),
        ("Healthy Snacks", "Healthy Snacks"),
        ("Baby Foods", "Baby Foods"),
        ("Beverages", "Beverages"),
        ("Vegetables", "Vegetables"),
        ("Fruits", "Fruits"),
        ("Dairy", "Dairy"),
        ("Seafood", "Seafood"),
    ]

    name = models.CharField(max_length=200)
    price = models.FloatField()
    description = models.TextField()
    halal_certified = models.BooleanField(default=True)
    ingredients = models.TextField()
    source = models.CharField(max_length=200)
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES)

    image = CloudinaryField('image', blank=True, null=True)

    def __str__(self):
        return self.name


# =========================
# CART MODEL
# =========================
class CartItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)


# =========================
# ORDER MODEL (UPDATED)
# =========================
class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # ✅ IMPORTANT

    name = models.CharField(max_length=200)
    address = models.TextField()
    phone = models.CharField(max_length=15)

    total_amount = models.FloatField()

    payment_id = models.CharField(max_length=255, null=True, blank=True)  # ✅ Razorpay

    status = models.CharField(
        max_length=50,
        default="Placed"   # later: Paid, Shipped, Delivered
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} - {self.user.username}"


# =========================
# ORDER ITEMS
# =========================
class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items"
    )
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    quantity = models.IntegerField()
    price = models.FloatField()  # ✅ store price at time of purchase

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"