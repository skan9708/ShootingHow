from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter, Route
from staticlist import views

router = DefaultRouter()
router.include_root_view = False
router.register(r'', views.StaticlistViewSet, basename="staticlist-items")

urlpatterns = [
    path('', include(router.urls)),
]
