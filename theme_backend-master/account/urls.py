from django.contrib import admin
from django.urls import path, include

from rest_framework.routers import DefaultRouter

from account import views
from account.routers import UserRouter

user_router = UserRouter()
user_router.include_root_view = False
user_router.register(r'', views.UserViewSet, basename="user")

router = DefaultRouter()
router.register(r'terms', views.TermsViewSet, basename="terms")


urlpatterns = [
    path('', include(user_router.urls)),
    path('', include(router.urls)),

    # kakao login
    path('kakao/login/', views.KakaoLoginView.as_view()),
    path('kakao/login/callback/', views.KakaoCallbackView.as_view()),
    
]