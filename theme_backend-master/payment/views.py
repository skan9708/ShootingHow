from http.client import ResponseNotReady
from django.contrib.auth import authenticate, get_user_model, login, logout

from django.shortcuts import redirect

from rest_framework import status, viewsets, mixins
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from theme.utils import send_sms, default_sms_params
from theme import messages
from theme.permissions import IsAuthenticatedAndIsInstructor
from product.serializers import (
    ProductInfoSerializer, ReservationCalendarSerializer,
    ReservationScheduleSerializer, ReservationSerializer,
    ReservationProductsSerializer, ReservationCalendarDetailSerializer,
    )

from payment.serializers import OrderIDSerializer

from product.models import (
    ProductInfo, ReservationCalendar, 
    ReservationSchedule, Reservation,
)

from payment.models import (
    OrderID, PaymentHistory,
)
from payment.toss import payment, add_payment_history

def instructor_request_send_sms(reservation):
    params = default_sms_params.copy()
    replace_dict = {
        "$(고객명)": reservation.fullname,
        "$(예약날짜)": str(reservation.calendar_date.date),
        "$(예약시간)": reservation.get_usage_time(),
        "$(예약인원)": reservation.get_num_of_user(),
        "$(예약종목)": reservation.get_product_name(),
    }
    
    message = messages.PRODUCT_RESERVATION_SUCCESS_MESSAGE
    
    for key, value in replace_dict.items():
        message = message.replace(key, value)
    
    params[f'rec_1'] = reservation.phone
    params[f'msg_1'] = message
    send_sms(params)

class ReservationPaymentView(viewsets.ViewSet):
    def create(self, request):
        data = request.data
        
        order_id = OrderID.objects.get(uuid=data.get('orderId'))
        order_data = OrderIDSerializer(order_id).data
        
        #TODO 프론트에서 order id 1개당 1개의 처리만 하도록 해야 함
        # if PaymentHistory.objects.filter(order_id=order_id, reservation__reservation_status='success').exists():
            # return Response({"error": "이미 결제된 예약입니다."}, status=status.HTTP_400_BAD_REQUEST)
        
        if order_id.amount != int(data.get('amount', -999999)):
            return Response({"error": "가격 정보가 잘못되었습니다."}, status=status.HTTP_400_BAD_REQUEST)

        reservation_serializer = ReservationSerializer(data=order_data, context={'request': request})
        reservation_serializer.is_valid(raise_exception=True)

        # 결제 to toss
        response_data = payment(data)
        
        #TODO 무통장입금 처리해야 함
        if response_data.get("code", ""):
            return Response({'error': response_data.get("message", "")}, status=status.HTTP_400_BAD_REQUEST)
        
        payment_history = add_payment_history(response_data)
        
        if payment_history.status == 'DONE':
            reservation = reservation_serializer.save(reservation_status='success')
            payment_history.reservation = reservation
            payment_history.save()
            
            instructor_request_send_sms()
            
            return Response({'message': reservation.id})

        print("occured except!!")
        print(payment_history.raw_data)
        return Response({'message': 'false'}, status=status.HTTP400)
        
        # serializer = ReservationSerializer(data=request.data, context={"request": request})
        # serializer.is_valid(raise_exception=True)
        # return Response({})
        
        # add_payment_history(request.data)
        # if

        # return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    def put(self, request):
        add_payment_history(request.data)
        reservation = request.data.get("reservation_id")
        
    @action(detail=False, methods=["post"])
    def check(self, request):
        serializer = ReservationSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        amount = serializer.amount
        user = request.user

        data = request.data
        data["calendar_date_id"] = data.pop("calendar_date")
        data["product_option_id"] = data.pop("product_option")
        data["num_of_man"] = int(data["num_of_man"])
        data["num_of_woman"] = int(data["num_of_woman"])
        data["amount"] = amount
        data["user"] = user

        order_id = OrderID(**data)
        order_id.save()
        customer_name = user.fullname

        product_name = f"{customer_name} / {order_id.product_option.parent.name} {order_id.product_option.name} {order_id.num_of_man + order_id.num_of_woman}명"

        return Response({
            "order_id": order_id.uuid, 
            "amount": amount,
            "product_name": product_name,
            "customer_name": customer_name
        })

    @action(detail=False, methods=["post"])
    def failed(self, request):
        print("########## failed!! ##########")
        print(request.data)
        print("##############################")
        return Response({})