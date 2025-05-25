from datetime import datetime, timedelta, time

from collections import OrderedDict

from django.conf import settings
from rest_framework import serializers

from product.models import (
    ProductInfo, ReservationCalendar, 
    ReservationSchedule, Reservation,
    ProductIntroduce, SwimReservationManagement
)

from payment.models import (
    OrderID, PaymentHistory
)

class OrderIDSerializer(serializers.ModelSerializer):
    # user_id = serializers.IntegerField(source='user.id')
    # user_id = serializers.SerializerMethodField(source='user')
    # calendar_date_id = serializers.IntegerField(source='calendar_date.id')
    # product_option_id = serializers.IntegerField(source='product_option.id')
    
    class Meta:
        model = OrderID
        fields = ['user', 'num_of_man', 'num_of_woman', 'amount',
                  'start_time', 'calendar_date', 'product_option',
                  'fullname', 'phone', 'email', 
                  ]

