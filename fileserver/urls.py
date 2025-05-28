from django.contrib import admin
from django.urls import path, include
from . import views

from rest_framework.routers import DefaultRouter

# router = DefaultRouter()
# router.include_root_view = False
# router.register(r'article/inquiry', views.InquiryAttachmentViewSet, basename="inquiry-attachment")
# router.register(r'article/instructor', views.InstructorAttachmentViewSet, basename="inquiry-attachment")
# router.register(r'article/notice', views.NoticeAttachmentViewSet, basename="notice-attachment")

router = DefaultRouter()
router.include_root_view = False
# router.register(r'article/inquiry', views.InquiryAttachmentViewSet, basename="inquiry-attachment")
# router.register(r'article/instructor', views.InstructorAttachmentViewSet, basename="instructor-attachment")
# router.register(r'article/notice', views.NoticeAttachmentViewSet, basename="notice-attachment")


urlpatterns = [
    path('user/license/<str:filename>/', views.UserLicenseAttachmentView.as_view()),
    path('product/image/<str:filename>/', views.ProductImageView.as_view()),
    path('static/image/<str:filename>/', views.StaticListImageView.as_view()),
    path('', include(router.urls)),
]