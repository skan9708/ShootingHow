from django.db import models
from product.models import ReservationCalendar, ProductInfo, Reservation
from django.core.validators import RegexValidator
from account.models import User
import uuid

# Create your models here.

class PaymentHistory(models.Model):
    order_name = models.CharField("주문 명", max_length=100, editable=False)
    status = models.CharField("결제 상태", max_length=20, editable=False)
    easy_pay_info = models.TextField("이지페이 정보", blank=True, null=True, editable=False)
    card_info = models.TextField("카드 정보", blank=True, null=True, editable=False)
    requested_at = models.DateTimeField("요청일자", editable=False)
    approved_at = models.DateTimeField("승인일자", editable=False)
    amount = models.IntegerField("가격", editable=False)
    raw_data = models.TextField("원본 데이터")

    def __str__(self):
        return f"{self.order_id.user.fullname}님의 예약 / {self.order_name} / {self.amount}원 / {self.status}"
class OrderID(models.Model):
    phone_validator = RegexValidator(regex=r'01[0|1|6|7|8|9]\d{3,4}\d{4}$',
                                     message='올바른 핸드폰 번호를 입력해주세요.',
                                     code='invalid')

    uuid = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)
    payment_history = models.ForeignKey(PaymentHistory, verbose_name="결제 정보", on_delete=models.SET_NULL, editable=False, null=True, default=None)
    reservation = models.ForeignKey(Reservation, verbose_name="예약 정보", on_delete=models.SET_NULL, editable=False, null=True, default=None)
    
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    num_of_man = models.IntegerField("남성 인원", default=0)
    num_of_woman = models.IntegerField("여성 인원", default=0)
    amount = models.IntegerField("가격")
    calendar_date = models.ForeignKey(ReservationCalendar, verbose_name="예약 일자", on_delete=models.SET_NULL, null=True)
    product_option = models.ForeignKey(ProductInfo, verbose_name="예약 상품 옵션", on_delete=models.SET_NULL, null=True)
    start_time = models.TimeField("예약 시작 시간")

    # 예약자 정보
    fullname = models.CharField("예약자 이름", max_length=20)
    phone = models.CharField("핸드폰번호", validators=[phone_validator], max_length=20)
    email = models.EmailField("예약자 이메일")

    def __str__(self):
        return f"{self.user.fullname} 님의 예약 / {self.uuid}"

