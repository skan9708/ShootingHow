from django.contrib.auth import authenticate, get_user_model, login, logout
from django.conf import settings
from django.shortcuts import redirect
from django.contrib.auth.hashers import check_password

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response

from theme.permissions import IsAuthenticatedOrCreateOnly, IsAuthenticated

from account.serializers import UserSerializer, TermsSerializer
from account.models import User, Terms

from payment.toss import payment, add_payment_history

from theme.utils import send_sms, default_sms_params
from theme import messages

from datetime import datetime, timedelta
import uuid

def signup_send_sms(user):
    params = default_sms_params.copy()
    replace_dict = {
        "$(고객명)": user.fullname,
    }
    
    message = messages.SIGNUP_MESSAGE
    
    for key, value in replace_dict.items():
        message = message.replace(key, value)
    
    params[f'rec_1'] = user.phone
    params[f'msg_1'] = message
    send_sms(params)
    
class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrCreateOnly]
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def get_object(self):
        return self.request.user
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        signup_send_sms(user)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_active = False
        instance.save()
        logout(request)
        
        return Response({"message": "account deactive success"}, status=status.HTTP_200_OK)
    
    
    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def login(self, request):
        print("--- LOGIN ATTEMPT RECEIVED ---")
        print("Request Data:", request.data)
        
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({"error": "이메일과 비밀번호를 모두 입력해주세요."},
                            status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, email=email, password=password)
        
        print("User authenticated:", user)
        
        if not user:
            print("Authentication failed for:", email)
            return Response({"error": "존재하지 않는 계정이거나 비밀번호가 일치하지 않습니다."},
                            status=status.HTTP_400_BAD_REQUEST)
        
        login(request, user)
        print("Login successful for user:", user.email)

        return Response({"message": "login success"}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=["delete"], permission_classes=[IsAuthenticated])
    def logout(self, request):
        logout(request)

        return Response({"message": "logout success"}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=["post"], permission_classes=[IsAuthenticated])
    def change_password(self, request, *args, **kwargs):
        """비밀번호 변경"""
        current_password = request.data.get("current_password")
        password = request.data.get("password")
        user = request.user
        
        if not check_password(current_password, user.password):
            return Response({"error": "비밀번호가 일치하지 않습니다."}, status=status.HTTP_400_BAD_REQUEST)
            
        user.set_password(password)
        user.save()
        login(request, user)
        
        return Response({"message": "success"})

class TermsViewSet(viewsets.GenericViewSet):
    serializer_class = TermsSerializer
    queryset = Terms.objects.filter(type__in=['privacy_policy', 'terms_of_service', 'rejection_email'])
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['get'])
    def privacy_policy(self, request):
        obj = self.get_queryset().get(type='privacy_policy')
        serializer = self.get_serializer(obj)
        
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def terms_of_service(self, request):
        try:
            obj = self.get_queryset().get(type='terms_of_service')
            serializer = self.get_serializer(obj)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Terms.DoesNotExist:
            return Response({"error": "Terms of service not found."}, status=status.HTTP_404_NOT_FOUND)
        except Terms.MultipleObjectsReturned:
            obj = self.get_queryset().filter(type='terms_of_service').first()
            serializer = self.get_serializer(obj)
            return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def rejection_email(self, request):
        try:
            obj = self.get_queryset().get(type='rejection_email')
            serializer = self.get_serializer(obj)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Terms.DoesNotExist:
            return Response({"error": "Rejection email terms not found."}, status=status.HTTP_404_NOT_FOUND)
        except Terms.MultipleObjectsReturned:
            obj = self.get_queryset().filter(type='rejection_email').first()
            serializer = self.get_serializer(obj)
            return Response(serializer.data, status=status.HTTP_200_OK)
