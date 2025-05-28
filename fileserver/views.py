from django.core.files.storage import FileSystemStorage
from django.http import FileResponse
from django.views.static import serve

from rest_framework import viewsets, mixins
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
# from article.serializers import (
#     InquiryAttachmentSerializer, InstructorAttachmentSerializer,
#     NoticeAttachmentSerializer
# )

from theme.permissions import IsAuthenticatedAndIsInstructor, IsAuthenticated, IsAdminUser

# from article.models import InquiryAttachment, InstructorAttachment, Notice

import os

# class InstructorAttachmentViewSet(mixins.RetrieveModelMixin,
#                                           viewsets.GenericViewSet):
#     permission_classes = [IsAuthenticatedAndIsInstructor]
#     serializer_class = InstructorAttachmentSerializer
#     queryset = InstructorAttachment.objects.all()
#     
#     def retrieve(self, request, *args, **kwargs):
#         instance = self.get_object()
#         attachment = instance.attachment
#         response = FileResponse(open(attachment.path, 'rb'))
#         response['Content-Disposition'] = f'attachment; filename="{os.path.basename(attachment.name)}"'
#         return response

# class NoticeAttachmentViewSet(mixins.RetrieveModelMixin,
#                                           viewsets.GenericViewSet):
#     permission_classes = [AllowAny]
#     serializer_class = NoticeAttachmentSerializer
#     queryset = Notice.objects.all()
#     
#     def retrieve(self, request, *args, **kwargs):
#         instance = self.get_object()
#         attachment = instance.attachment
#         response = FileResponse(open(attachment.path, 'rb'))
#         response['Content-Disposition'] = f'attachment; filename="{os.path.basename(attachment.name)}"'
#         return response
    
    
# class InquiryAttachmentViewSet(mixins.RetrieveModelMixin,
#                                        viewsets.GenericViewSet):
#     permission_classes = [IsAuthenticated]
#     serializer_class = InquiryAttachmentSerializer
#     
#     def get_queryset(self):
#         user = self.request.user
#         if user.is_staff or user.is_superuser:
#             return InquiryAttachment.objects.all()
# 
#         return InquiryAttachment.objects.filter(article__author=user)
#     
#     def retrieve(self, request, *args, **kwargs):
#         instance = self.get_object()
#         attachment = instance.attachment
#         response = FileResponse(open(attachment.path, 'rb'))
#         response['Content-Disposition'] = f'attachment; filename="{os.path.basename(attachment.name)}"'
#         return response
    

class UserLicenseAttachmentView(APIView):
    permission_classes = [IsAdminUser]
    
    def get(self, request, filename):
        file_path = f'{os.path.abspath("media/user/license/")}/{filename}'
        response = FileResponse(open(file_path, 'rb'))
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response
    
    
class ProductImageView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, filename):
        file_path = f'{os.path.abspath("media/product/image/")}/{filename}'
        response = FileResponse(open(file_path, 'rb'))
        # response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response
    
    
class StaticListImageView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, filename):
        file_path = f'{os.path.abspath("media/static/image/")}/{filename}'
        response = FileResponse(open(file_path, 'rb'))
        # response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response
    