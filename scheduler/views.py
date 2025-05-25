
import time
from datetime import datetime, timedelta
from pprint import pprint

from theme.utils import send_sms, default_sms_params
from product.models import Reservation
from account.models import User
from theme import messages

class reservation_notify:
    schedule = {
        'day': '*',
        'hour': '14',
        'minute': '0',
        'misfire_grace_time': 600, # 10분까지는 스케줄러가 지연되도 괜찮음
    }
    
    @staticmethod
    def start():
        params = default_sms_params.copy()
        next_day = (datetime.now() + timedelta(days=1)).date()

        queryset = Reservation.objects.filter(calendar_date__date=next_day)
        for i, alert_reservation in enumerate(queryset, 1):
            replace_dict = {
                "$(고객명)": alert_reservation.fullname,
                "$(예약날짜)": str(next_day),
                "$(예약시간)": alert_reservation.get_usage_time(),
                "$(예약인원)": alert_reservation.get_num_of_user(),
                "$(예약종목)": alert_reservation.get_product_name(),
                #TODO 금액 표시 추가 (60000 -> 60,000원)
                "$(금액)": str(alert_reservation.amount),
            }
            
            message = messages.PRODUCT_RESERVATION_CHECK_MESSAGE
            
            for key, value in replace_dict.items():
                message = message.replace(key, value)
            
            params[f'rec_{i}'] = alert_reservation.phone
            params[f'msg_{i}'] = message
        
        send_sms(params)

class register_instructor_expired_notify:
    schedule = {
        'day': '*',
        'hour': '14',
        'minute': '0',
        'misfire_grace_time': 600, # 10분까지는 스케줄러가 지연되도 괜찮음
    }
    
    @staticmethod
    def start():
        params = default_sms_params.copy()
        next_week = (datetime.now() + timedelta(days=7)).date()

        queryset = User.objects.filter(role='registered_instructor', instructor_expired_date=next_week)
        for i, user in enumerate(queryset, 1):
            replace_dict = {
                "$(고객명)": user.fullname,
                "$(페이지주소)": 't-sports.kr',
            }
            
            message = messages.REGISTER_INSTRUCTOR_EXPIRATION_MESSAGE
            
            for key, value in replace_dict.items():
                message = message.replace(key, value)
            
            params[f'rec_{i}'] = user.phone
            params[f'msg_{i}'] = message
        
        send_sms(params)
