from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from article import views

router = DefaultRouter()
router.include_root_view = False
router.register(r'instructor/comment', views.InstructorCommentViewSet, basename="instructor-comment")
router.register(r'instructor', views.InstructorViewSet, basename="instructor")
# router.register(r'inquiry/comment', views.InquiryCommentViewSet, basename="inquiry-comment")
router.register(r'inquiry', views.InquiryViewSet, basename="inquiry")

router.register(r'notice', views.NoticeViewSet, basename="notice")
router.register(r'faq', views.FaqViewSet, basename="faq")

urlpatterns = [
    path('', include(router.urls)),
    
    # path('notice/<pk>/', views.adsfadf.as_view(), name="asdfasdF???"),
    # path('notice/<int:pk>/', views.NoticeView.as_view()),
    
    # path('inquiry/', views.InquiryView.as_view()),
    # path('inquiry/<int:pk>/', views.InquiryView.as_view()),
    
    # path('faq/', views.InquiryView.as_view()),
]
