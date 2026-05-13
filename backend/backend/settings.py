
from pathlib import Path
from datetime import timedelta
import cloudinary
import cloudinary.uploader
import cloudinary.api
import os
import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-9jue_4d7uha*2q6z6x)qfc#8&o1z@3(^h9&f_%+^7&dj1#cw0a'

DEBUG = False

ALLOWED_HOSTS = [
    "halal-marketplace.onrender.com",
    "localhost",
    "127.0.0.1"
]

# =========================
# INSTALLED APPS
# =========================
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'products',
    'accounts',

    'corsheaders',

    'cloudinary',
    'cloudinary_storage',

    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
]

# =========================
# REST FRAMEWORK
# =========================
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.AllowAny",
    ),
}

# =========================
# JWT SETTINGS
# =========================
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=15),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),

    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,

    "AUTH_HEADER_TYPES": ("Bearer",),
}

# =========================
# CLOUDINARY
# =========================
CLOUDINARY_STORAGE = {
    "CLOUD_NAME": "doihibg9v",
    "API_KEY": "662139659658794",
    "API_SECRET": "cftuDaKH1v4g9jMEJYE0NHbalnU",
}

cloudinary.config(
    cloud_name="doihibg9v",
    api_key="662139659658794",
    api_secret="cftuDaKH1v4g9jMEJYE0NHbalnU",
    secure=True
)

DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'

# =========================
# MIDDLEWARE
# =========================
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',

    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# =========================
# ROOT URLS / WSGI
# =========================
ROOT_URLCONF = 'backend.urls'

WSGI_APPLICATION = 'backend.wsgi.application'

# =========================
# DATABASE
# =========================
DATABASES = {
    'default': dj_database_url.parse(
        "postgresql://halal_user:71MPAMm7BWJ7zjiTKI4LKUtYoFqAdBYc@dpg-d827fjt0lvsc73c63j90-a.oregon-postgres.render.com/halal_marketplace",
        conn_max_age=600
    )
}
# =========================
# CORS
# =========================
CORS_ALLOW_ALL_ORIGINS = True

# =========================
# INTERNATIONALIZATION
# =========================
LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

# =========================
# STATIC FILES
# =========================
STATIC_URL = '/static/'

STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# =========================
# DEFAULT AUTO FIELD
# =========================
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# =========================
# TEMPLATES
# =========================
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]