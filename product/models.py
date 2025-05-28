from datetime import time

from django.db import models
from mptt.models import MPTTModel, TreeForeignKey
from django.core.validators import FileExtensionValidator
from django.conf import settings

ATTACHMENT_ALLOW_EXTENTIONS = ["png", "jpg", "jpeg"]

class ProductInfo(MPTTModel):
    TYPES = {
        0: "title",
        1: "category",
        2: "info",
        3: "option"
    }
    
    parent = TreeForeignKey("self", on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    name = models.CharField(max_length=50)
    value = models.TextField(default="", null=True, blank=True)
    type = models.CharField(max_length=10, blank=True)
    
    # 풋살장 관련 상세 정보 필드 (level=2 등 특정 조건에서 의미를 가짐)
    address = models.CharField("풋살장 주소", max_length=255, null=True, blank=True)
    contact_number = models.CharField("풋살장 전화번호", max_length=20, null=True, blank=True)
    image_url = models.URLField("이미지 URL", max_length=200, null=True, blank=True)
    usage_hours = models.CharField("이용 가능 시간", max_length=100, null=True, blank=True)
    price = models.IntegerField("대표 금액", default=0, null=True, blank=True) # 풋살장 대표 가격
    reservation_notes = models.TextField("예약 시 유의사항", null=True, blank=True)
    parking_info = models.CharField("주차 정보", max_length=255, null=True, blank=True)
    rental_info = models.TextField("대여 가능 장비 목록", null=True, blank=True)
    
    def save(self, *args, **kwargs):
        if not self.level:
            super().save(*args, **kwargs)
            self.type = self.TYPES[self.level]
            self.save()
            return
        
        # 특정 가격 object의 name이 update 될 경우 동일한 상품에 대해서 일괄 업데이트
        # name field를 readonly로 지정했기 때문에 사용하지 않음
        if self.level and self.level == 3:
            parent = self.parent
            parent_of_parent = parent.parent
            current_index = list(parent.get_children().values_list('id', flat=True).order_by("lft")).index(self.id)
            
            for child in parent_of_parent.get_children():
                childs_of_child = child.get_children()
                same_key_product = childs_of_child.order_by("lft")[current_index]
                childs_of_child.filter(id=same_key_product.id).update(name=self.name)
            
        self.type = self.TYPES[self.level]
        super().save(*args, **kwargs)
    
    def __str__(self):
        if self.level == 3:
            return f'{self.name} / {self.value}'
        else: return self.name

class ProductIntroduce(models.Model):
    product = models.OneToOneField(ProductInfo, verbose_name="상품", on_delete=models.CASCADE)
    # image = models.FileField("이미지", upload_to="product/image", validators=[FileExtensionValidator(allowed_extensions=ATTACHMENT_ALLOW_EXTENTIONS)]) # ProductInfo.image_url로 대체 고려
    # title = models.CharField("상품 제목", max_length=20) # ProductInfo.name으로 대체 고려
    # available_time = models.CharField("이용가능시간", max_length=50) # ProductInfo.usage_hours로 대체 고려
    # description = models.CharField("상품 설명", max_length=500) # ProductInfo.reservation_notes로 대체 고려
    period = models.IntegerField("이용 시간", default=4)


class ReservationCalendar(models.Model):
    product_category = models.ForeignKey(ProductInfo, verbose_name="예약 상품", on_delete=models.SET_NULL, null=True)
    date = models.DateField("날짜")
    
    def __str__(self):
        return f"{self.product_category.name} / {self.date}"

class ReservationSchedule(models.Model):
    calendar_date = models.ForeignKey(ReservationCalendar, verbose_name="예약일자", on_delete=models.SET_NULL, null=True, related_name="reservation_schedule")
    total_num_of_people = models.IntegerField("총 예약자 수", default=0)
    time = models.TimeField("시간")
            
    def __str__(self):
        return f"{self.calendar_date} / {self.time.hour}:{self.time.minute}0"

class Reservation(models.Model):
    STATUSES = (
        ("success", "예약완료"),
        ("wait_payment", "입금대기"),
        ("cancel", "예약취소"),
    )
    
    user = models.ForeignKey("account.User", verbose_name="예약자", on_delete=models.SET_NULL, null=True)
    calendar_date = models.ForeignKey(ReservationCalendar, verbose_name="이용 날짜", on_delete=models.SET_NULL, null=True, related_name="reservation_info")
    reservation_code = models.CharField("예약 번호", max_length=50, default="", blank=True)
    product_option = models.ForeignKey(ProductInfo, verbose_name="예약 상품 옵션", on_delete=models.SET_NULL, null=True)
    num_of_people = models.IntegerField("총 예약자 수", default=0)
    start_time = models.TimeField("예약 시작 시간")
    # period = models.IntegerField("이용 시간", default=0)
    amount = models.IntegerField("가격")
    reservation_schedule = models.ManyToManyField(ReservationSchedule, verbose_name="이용 시간")
    reservation_at = models.DateTimeField("예약 등록 일자", auto_now_add=True)
    reservation_status = models.CharField("예약 상태", max_length=20, choices=STATUSES)

    # 예약자 정보
    fullname = models.CharField("예약자 이름", max_length=20)
    phone = models.CharField("핸드폰번호", max_length=20)
    email = models.EmailField("예약자 이메일")
    memo = models.CharField("메모", max_length=200, default="", blank=True)
    
    def __str__(self):
        return f"{self.user.fullname} / {self.product_option.parent.name} / {self.product_option.name}"
    
    def get_usage_time(self):
        reservation_schedule = list(self.reservation_schedule.all().order_by('time'))
        start, end = reservation_schedule[0], reservation_schedule[-1]
        start = str(start.time)[:-3]
        end = str(time(end.time.hour + 1, end.time.minute))[:-3]
        
        return f'{start} ~ {end}'
    
    def get_num_of_user(self):
        return f'총 {self.num_of_people}인'
    
    def get_product_name(self):
        return f'{self.product_option.parent.name} - {self.product_option.name}' 
    
    def create_reservation_code(slef):
        """
        TODO
        예약 번호 생성
        RS(예약구분)+221231(예약날짜)+0001(당일예약순서)
        ex) RS2212310001
        """

class SwimReservationManagement(models.Model):
    TYPES = (
        ("weekly", "평일"),
        ("weekend", "주말"),
    )
    
    month = models.IntegerField("월")
    type = models.CharField("평일/주말", max_length=20)
    
    def __str__(self):
        return f"{self.month}월 {dict(self.TYPES)[self.type]}"