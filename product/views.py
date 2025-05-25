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
from product.serializers import (
    ProductInfoSerializer, ReservationCalendarSerializer,
    ReservationScheduleSerializer, ReservationSerializer,
    ReservationProductsSerializer, ReservationCalendarDetailSerializer,
    ReservationUpdateSerializer, 
    )

from product.models import (
    ProductInfo, ReservationCalendar, 
    ReservationSchedule, Reservation,
)

class ProductInfoViewSet(mixins.RetrieveModelMixin,
                         viewsets.GenericViewSet):
    
    serializer_class = ProductInfoSerializer
    permission_classes = [AllowAny]
    pagination_class = None
    
    def get_object(self):
        type_ = self.request.GET.get('type')
        return ProductInfo.objects.filter(level=0, name=type_).first()

    param = openapi.Parameter('type', openapi.IN_QUERY, description="product info params",
                              type=openapi.TYPE_STRING, enum=["잠수풀", "교육비", "투어비"],
                              required=True)

    @swagger_auto_schema(manual_parameters=[param])
    def retrieve(self, request, *args, **kwargs):
        if self.request.GET.get('type') not in ['잠수풀', '교육비', '투어비']:
            return Response({'error': '잘못된 접근입니다.'})

        return super().retrieve(request, *args, **kwargs)

    @action(detail=False, methods=["post"])
    def check(self, request):
        serializer = ReservationSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        amount = serializer.amount

        return Response({"amount": amount})
    
class ReservationViewset(viewsets.ModelViewSet):
    serializer_class = ReservationCalendarSerializer
    permission_classes = [AllowAny]
    pagination_class = None
        
    def get_queryset(self):
        if self.action == 'list':
            year = self.request.GET.get('year')
            month = self.request.GET.get('month')
            product_id = self.request.GET.get('product_id')
            
            try:
                product_info = ProductInfo.objects.get(id=product_id)
            except:
                return None
            
            return ReservationCalendar.objects.filter(date__year__gte=year,
                                                      date__month__gte=month,
                                                      date__year__lte=year,
                                                      date__month__lte=month,
                                                      product_category=product_info.parent).order_by('date')
            
        if self.action in ['retrieve', 'reservation_list', 'update']:
            return Reservation.objects.filter(user=self.request.user)
    
    params = [
        openapi.Parameter('Year', openapi.IN_QUERY, type=openapi.TYPE_INTEGER),
        openapi.Parameter('Month', openapi.IN_QUERY, type=openapi.TYPE_INTEGER),
        openapi.Parameter('Day', openapi.IN_QUERY, type=openapi.TYPE_INTEGER),
        openapi.Parameter('product_id', openapi.IN_QUERY, type=openapi.TYPE_INTEGER),]
    @swagger_auto_schema(manual_parameters=params,
                         operation_description="None or Year, Month or Year, product_id, Month, Day, product_id")
    def list(self, request, *args, **kwargs):
        if not request.GET:
            products = ProductInfo.objects.get(level=0, name="잠수풀").get_children()
            instance = []
            
            for product in products:
                # 일반수영 결제 구현 후 해당 코드 삭제
                instance += list(product.get_children().exclude(name__contains="일반수영"))
                # instance += list(product.get_children())
                
            serializer = ReservationProductsSerializer(instance, many=True)
            
            return Response(serializer.data)
        
        day = request.GET.get('day', '')
        product_id = request.GET.get('product_id', '')
        product_info = ProductInfo.objects.get(id=product_id)
        
        # 일반수영은 바로 결제 페이지로 이동        
        if product_info.level != 2:
            return Response({'error': '잘못된 접근입니다.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if day:
            self.serializer_class = ReservationCalendarDetailSerializer
            date = request.GET.get("year") \
                   + f'-{request.GET.get("month")}' \
                   + f'-{request.GET.get("day")}'
                
            instance, _ = ReservationCalendar.objects.get_or_create(date=date, product_category=product_info.parent)
            serializer = self.get_serializer(instance)
            
            return Response(serializer.data)

        return super().list(request, *args, **kwargs)
    
    # def retrieve(self, request, *args, **kwargs):
        # return super().retrieve(request, *args, **kwargs)
    
    # def get_serializer_context(self):
        # context = super().get_serializer_context()
        # context.update({"request": self.request})
        # return context
    
    @swagger_auto_schema(operation_description="평일 종일권 예약 시 start_time=00:00")
    def create(self, request, *args, **kwargs):
        """예약 내용이 유효한지 확인"""
        self.serializer_class = ReservationSerializer
        
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            return Response({"message": "validation success"}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        #TODO 결제 로직 추가
        # serializer.save(status='success')
        # headers = self.get_success_headers(serializer.data)
        # return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    @action(detail=False, methods=["get"], url_path="list")
    def reservation_list(self, request, *args, **kwargs):
        self.serializer_class = ReservationSerializer
        return super().list(request, *args, **kwargs)
    
    def retrieve(self, request, *args, **kwargs):
        self.serializer_class = ReservationSerializer
        return super().retrieve(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        self.serializer_class = ReservationSerializer
        # context = {
        #     'request': request,
        # }
        
        # if request.data.get('attachments', []):
        #     context['attachments'] = [x for x in request.data.getlist('attachments') if not isinstance(x, str)]
            
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True,)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        # if getattr(instance, '_prefetched_objects_cache', None):
        #     instance._prefetched_objects_cache = {}

        return Response(serializer.data)
    
#TODO 예약 viewset 만들기
    
# 예약
# 예약취소
# 예약변경
# 예약 상태 확인
