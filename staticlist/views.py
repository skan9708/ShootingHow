from http.client import ResponseNotReady
from django.contrib.auth import authenticate, get_user_model, login, logout
from django.conf import settings
from django.shortcuts import redirect

from rest_framework import status, viewsets, mixins
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.views import APIView
from rest_framework.response import Response

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from theme.permissions import IsAuthenticatedAndIsInstructor
from staticlist.serializers import StaticItemSerializer

from staticlist.models import StaticItem

class StaticlistViewSet(mixins.ListModelMixin,
                         viewsets.GenericViewSet):
    
    serializer_class = StaticItemSerializer
    permission_classes = [AllowAny]
    pagination_class = None
    
    def get_queryset(self):
        code = self.request.GET.get('code', '')
        return StaticItem.objects.filter(static__code=code).order_by('-id')
    