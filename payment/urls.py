from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from payment import views

router = DefaultRouter()
router.register(r'', views.ReservationPaymentView, basename="payment")

urlpatterns = [
    path('', include(router.urls)),
]