
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

    category = models.CharField(
        max_length=100,
        choices=CATEGORY_CHOICES
    )

    image = CloudinaryField(
        'image',
        blank=True,
        null=True
    )
    stock_quantity = models.PositiveIntegerField(
    default=10
    )

    def __str__(self):
        return self.name


# =========================
# CART MODEL
# =========================
class CartItem(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE
    )

    quantity = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.user.username} - {self.product.name}"


# =========================
# ORDER MODEL
# =========================
class Order(models.Model):

    STATUS_CHOICES = [
        ("Placed", "Placed"),
        ("Packed", "Packed"),
        ("Shipped", "Shipped"),
        ("Out for Delivery", "Out for Delivery"),
        ("Delivered", "Delivered"),
        ("Cancelled", "Cancelled"),
    ]

    PAYMENT_CHOICES = [
        ("Pending", "Pending"),
        ("Paid", "Paid"),
        ("Failed", "Failed"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    # CUSTOMER INFO
    name = models.CharField(max_length=200)

    address = models.TextField()

    phone = models.CharField(max_length=15)

    # PAYMENT
    payment_id = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_CHOICES,
        default="Pending"
    )

    # ORDER STATUS
    status = models.CharField(
        max_length=50,
        choices=STATUS_CHOICES,
        default="Placed"
    )

    # TOTAL
    total_amount = models.FloatField()

    # TRACKING
    tracking_id = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    estimated_delivery = models.DateField(
        blank=True,
        null=True
    )

    # =========================
    # TIMESTAMPS
    # =========================
    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    packed_at = models.DateTimeField(
        blank=True,
        null=True
    )

    shipped_at = models.DateTimeField(
        blank=True,
        null=True
    )

    out_for_delivery_at = models.DateTimeField(
        blank=True,
        null=True
    )

    delivered_at = models.DateTimeField(
        blank=True,
        null=True
    )

    cancelled_at = models.DateTimeField(
        blank=True,
        null=True
    )

    # =========================
    # AUTO TIMESTAMP HANDLER
    # =========================
    def save(self, *args, **kwargs):

        from django.utils.timezone import now

        if self.status == "Packed" and not self.packed_at:
            self.packed_at = now()

        if self.status == "Shipped" and not self.shipped_at:
            self.shipped_at = now()

        if self.status == "Out for Delivery" and not self.out_for_delivery_at:
            self.out_for_delivery_at = now()

        if self.status == "Delivered" and not self.delivered_at:
            self.delivered_at = now()

        if self.status == "Cancelled" and not self.cancelled_at:
            self.cancelled_at = now()

        super().save(*args, **kwargs)

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

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE
    )

    quantity = models.IntegerField()

    price = models.FloatField()

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"
    # =========================
# ADDRESS MODEL
# =========================
class Address(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="addresses"
    )

    full_name = models.CharField(
        max_length=200
    )

    phone = models.CharField(
        max_length=15
    )

    address_line = models.TextField()

    city = models.CharField(
        max_length=100
    )

    state = models.CharField(
        max_length=100
    )

    pincode = models.CharField(
        max_length=10
    )

    is_default = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.full_name} - {self.city}"

        
class WishlistItem(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        unique_together = ("user", "product")

    def __str__(self):
        return f"{self.user.username} - {self.product.name}"