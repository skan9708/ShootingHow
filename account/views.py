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

from article.models import InstructorComment
from article.serializers import InstructorCommentSimpleSerializer
from payment.toss import payment, add_payment_history

from theme.utils import send_sms, default_sms_params
from theme import messages

from datetime import datetime, timedelta
import requests
import uuid

def register_instructor_send_sms(user):
    params = default_sms_params.copy()
    replace_dict = {
        "$(고객명)": user.fullname,
        "$(등록강사만료일)": str(user.instructor_expired_date),
    }
    
    message = messages.REGISTER_INSTRUCTOR_MESSAGE
    
    for key, value in replace_dict.items():
        message = message.replace(key, value)
    
    params[f'rec_1'] = user.phone
    params[f'msg_1'] = message
    send_sms(params)
    
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
    
def instructor_request_send_sms(user):
    params = default_sms_params.copy()
    replace_dict = {
        "$(고객명)": user.fullname,
    }
    
    message = messages.INSTRUCTOR_REQUEST_MESSAGE
    
    for key, value in replace_dict.items():
        message = message.replace(key, value)
    
    params[f'rec_1'] = user.phone
    params[f'msg_1'] = message
    send_sms(params)

class KakaoLoginView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        """카카오 로그인 페이지 이동"""
        client_id = settings.KAKAO_REST_API_KEY
        redirect_uri = settings.KAKAO_REDIRECT_URI
        uri = f"{settings.KAKAO_LOGIN_URI}?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code"
        
        res = redirect(uri)
        return res


class KakaoCallbackView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        """카카오 로그인"""
        data = request.query_params

        # access_token 발급 요청
        code = data.get('code')
        if not code:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        request_data = {
            'grant_type': 'authorization_code',
            'client_id': settings.KAKAO_REST_API_KEY,
            'redirect_uri': settings.KAKAO_REDIRECT_URI,
            'client_secret': settings.KAKAO_CLIENT_SECRET_KEY,
            'code': code,
        }
        token_headers = {
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
        token_res = requests.post(settings.KAKAO_TOKEN_URI, data=request_data, headers=token_headers)

        token_json = token_res.json()
        access_token = token_json.get('access_token')

        if not access_token:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        access_token = f"Bearer {access_token}"
        
        # kakao 회원정보 요청
        auth_headers = {
            "Authorization": access_token,
            "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        }
        
        user_info_res = requests.get(settings.KAKAO_PROFILE_URI, headers=auth_headers)
        user_info_json = user_info_res.json()

        # social_type = 'kakao'
        kakao_id = user_info_json.get('id')
        kakao_account = user_info_json.get('kakao_account')
        
        if not kakao_account:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        email = kakao_account.get('email')
        phone = kakao_account.get('phone', '010-1234-1234').replace('-', '') # test
        birthyear = kakao_account.get('birthyear', '2000') # test
        birthday = kakao_account.get('birthday')
        birthday = f"{birthyear}-{birthday[:2]}-{birthday[2:]}"

        # 회원가입 및 로그인
        try:
            user = User.objects.get(kakao=kakao_id)
            
        except User.DoesNotExist:
            request.session['id'] = kakao_id
            request.session['phone'] = phone
            request.session['email'] = email
            request.session['birthday'] = birthday
            #TODO redirect 어디로 넘겨줄지 확인 필요
            return redirect({})

        login(request, user)
        return Response({"message": "login success"}, status=status.HTTP_200_OK)


class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrCreateOnly]
    serializer_class = UserSerializer
    queryset = []

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
    
    @action(detail=False, methods=["post"], permission_classes=[AllowAny], url_path="pass", url_name="pass")
    def pass_(self, request):
        """pass 본인인증"""
        from pprint import pprint
        pprint(request.data)
        return Response({"message": "아직 개발중임 좀 기다려요"}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def login(self, request):
        user = authenticate(request, **request.data)
        if not user:
            return Response({"error": "존재하지 않는 계정이거나 비밀번호가 일치하지 않습니다."},
                            status=status.HTTP_400_BAD_REQUEST)
        
        login(request, user)

        return Response({"message": "login success"}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=["delete"], permission_classes=[IsAuthenticated])
    def logout(self, request):
        logout(request)

        return Response({"message": "logout success"}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=["post"], permission_classes=[IsAuthenticated])
    def instructor(self, request, *args, **kwargs):
        """강사 신청"""
        #TODO license 파일 받는 방법 달라졌음
        user = request.user
        if user.role not in ['normal', 'waiting_instructor_request']:
            return Response({'error': '잘못된 접근입니다.'}, status=status.HTTP_400_BAD_REQUEST)
        
        data = request.data.dict()
        data['licenses'] = [{'image': x} for x in request.data.getlist('licenses')]
        
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save(role="waiting_instructor_request")
        
        instructor_request_send_sms(request.user)

        return Response(serializer.data)
    
    @action(detail=False, methods=["get", "post"], permission_classes=[IsAuthenticated])
    def register_instructor(self, request, *args, **kwargs):
        """등록 강사 신청"""
        
        REGISTER_INSTRUCTOR_AMOUNT = {
            'quarter': {'amount': 80000, 'expiration_period': 90}, 
            'year': {'amount': 240000, 'expiration_period': 365}}
        
        if request.method == 'get':
            return Response(REGISTER_INSTRUCTOR_AMOUNT)
        
        user = request.user
        
        if user.role not in ['instructor', 'registered_instructor']:
            return Response({'error': '잘못된 접근입니다.'}, status=status.HTTP_400_BAD_REQUEST)
        
        data = request.data.dict()
        period = data.pop('period')
        
        data['orderId'] = str(uuid.uuid4())
        data['amount'] = REGISTER_INSTRUCTOR_AMOUNT[period]['amount']
        response_data = payment(data)
        
        # if response_data.get("code", ""):
        #     return Response({'error': response_data.get("message", "")}, status=status.HTTP_400_BAD_REQUEST)
        
        payment_history = add_payment_history(response_data)
        
        #TODO 연장 처리 해야 함
        if payment_history.status == 'DONE':
            user.role = 'registered_instructor'
                
            expiration_period = REGISTER_INSTRUCTOR_AMOUNT[period]['expiration_period']
            today = datetime.now().date()
            
            if user.instructor_expired_date and user.instructor_expired_date < today:
                user.instructor_expired_date = today + timedelta(days=expiration_period)
            else:
                user.instructor_expired_date += timedelta(days=expiration_period)
            
            user.save()
            register_instructor_send_sms(user)
            
            return Response({'message': 'success'})
        
        print("occured except!!")
        print(payment_history.raw_data)
        return Response({'message': 'false'}, status=status.HTTP400)
            
    
    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def my_comments(self, request, *args, **kwargs):
        """내 댓글 조회"""
        # inquiry_comments = InquiryComment.objects.filter(author=request.user)
        instructor_comments = InstructorComment.objects.filter(author=request.user)
        data = []
        
        # data += InquiryCommentSimpleSerializer(inquiry_comments, many=True).data
        data += InstructorCommentSimpleSerializer(instructor_comments, many=True).data
        
        return Response(data)
    
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
    queryset = Terms.objects.filter(type__in=['privacy_policy', 'terms_of_service', 'rejection_email', 'instructor'])
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['get'])
    def privacy_policy(self, request):
        obj = self.get_queryset().get(type='privacy_policy')
        serializer = self.get_serializer(obj)
        
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def terms_of_service(self, request):
        serializer = self.get_queryset().filter(type='terms_of_service')
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def rejection_email(self, request):
        serializer = self.get_queryset().filter(type='rejection_email')
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'])
    def instructor(self, request):
        serializer = self.get_queryset().filter(type='instructor')
        return Response(serializer.data, status=status.HTTP_200_OK)
