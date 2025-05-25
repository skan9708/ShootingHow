from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter, Route, DynamicRoute
from product import views

product_info_router = DefaultRouter()
product_info_router.include_root_view = False
product_info_router.routes = [
    Route(
        url=r'^{prefix}{trailing_slash}$',
        mapping={
            'get': 'retrieve',
        },
        name='{basename}-list',
        detail=False,
        initkwargs={'suffix': 'List'}
    ),
    DynamicRoute(
        url=r'^{prefix}/{url_path}{trailing_slash}$',
        name='{basename}-{url_name}',
        detail=False,
        initkwargs={}
    )
]

product_info_router.register(r'price', views.ProductInfoViewSet, basename="product-price")

router = DefaultRouter()
router.include_root_view = False
router.register(r'reservation', views.ReservationViewset, basename="product-reservation")

urlpatterns = [
    path('', include(product_info_router.urls)),
    path('', include(router.urls)),
]
