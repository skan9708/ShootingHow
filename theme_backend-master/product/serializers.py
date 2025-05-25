from datetime import datetime, timedelta, time

from collections import OrderedDict

from django.conf import settings
from rest_framework import serializers

from product.models import (
    ProductInfo, ReservationCalendar, 
    ReservationSchedule, Reservation,
    ProductIntroduce, SwimReservationManagement
)

THEME_START_TIME = settings.THEME_START_TIME
THEME_END_TIME = settings.THEME_END_TIME

def get_remain_count_with_time(remain_counts, start, end):
    remain_counts = remain_counts[start:end]
    
    if isinstance(remain_counts[0], int):
        return min(remain_counts)
    else:
        return {
            "man": min([x["man"] for x in remain_counts]),
            "woman": min([x["woman"] for x in remain_counts]),
        }
    

def get_remain_count(product_category, reservation_schedule):
    if product_category.num_of_woman_limit:
        return {
            "man": product_category.num_of_man_limit - reservation_schedule.total_num_of_man,
            "woman": product_category.num_of_woman_limit - reservation_schedule.total_num_of_woman,
        }
        
    return product_category.num_of_man_limit - reservation_schedule.total_num_of_man



class ProductIntroduceSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField(read_only=True)
    period = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = ProductIntroduce
        fields = ['title', 'available_time', 'description', 'image', 'period', ]
        
    def get_image(self, obj):
        return obj.image.url
    
    def get_period(self, obj):
        return obj.period

class ProductInfoSerializer(serializers.ModelSerializer):
    # product_id = serializers.SerializerMethodField()
    header = serializers.SerializerMethodField()
    value = serializers.SerializerMethodField()
    child = serializers.SerializerMethodField()

    class Meta:
        model = ProductInfo
        fields = ['name', 'header', 'value', 'child']

    # def get_product_id(self, obj):
    #     if obj.level == 2:
    #         return obj.id
    #     return None
    
    def get_header(self, obj):
        if obj.level == 1:
            childs_of_child = obj.get_children().first().get_children()
            return childs_of_child.values_list('name', flat=True)
        return None
    
    def get_value(self, obj):
        if obj.level == 2:
            return obj.get_children().values_list('value', flat=True)
        return None
    
    def get_child(self, obj):
        # child node를 재귀적으로 돌면서 tree 생성
        if obj.level < 2:
            return ProductInfoSerializer(obj.get_children(), many=True).data
        return None
    
    # 값이 null인 필드 삭제
    def to_representation(self, instance):
        result = super().to_representation(instance)
        return OrderedDict([(key, result[key]) for key in result if result[key]])
    
    
class ReservationCalendarSerializer(serializers.ModelSerializer):
    # remain_user_count = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = ReservationCalendar
        fields = ['date']
        # fields = ['date', 'remain_user_count']
        
    def get_remain_user_count(self, obj):
        for i in range(THEME_START_TIME, THEME_END_TIME):
            _, _ = ReservationSchedule.objects.get_or_create(
                    calendar_date = obj,
                    time=f"{i}:00",
                )
        reservation_schedules = obj.reservation_schedule.all().order_by('time')
        if reservation_schedules:
            if "실내서핑" in obj.product_category.name:
                return {f"{x.time.hour}:{x.time.minute}0": x.suff_remain_count() for x in reservation_schedules}
            
            elif "잠수풀" in obj.product_category.name:
                return {f"{x.time.hour}:{x.time.minute}0": x.pool_remain_count() for x in reservation_schedules}
        
        return 0
        
        
class ReservationCalendarDetailSerializer(serializers.ModelSerializer):
    product_options = serializers.SerializerMethodField()
    remain_user_count = serializers.SerializerMethodField(read_only=True)
    introduce = serializers.SerializerMethodField(read_only=True)
    product_option = serializers.SerializerMethodField(read_only=True)
    amount = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = ReservationCalendar
        fields = ['id', 'product_options', 'date', 'introduce', 
                  'product_option', 'amount', 'remain_user_count', ]
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.product_info = ProductInfo.objects.get(id=self.context['request'].GET.get('product_id'))
        self.product_options = self.product_info.get_children()
        self.product_introduce = self.product_info.productintroduce
        self.product_option = None
        
    def get_product_options(self, obj):
        # product_info = ProductInfo.objects.get(id=self.context['request'].GET.get('product_id'))
        return self.product_options.values('id', 'name', 'value')
    
    def get_remain_user_count(self, obj):
        # ProductInfo.objects.all().update(
        #     num_of_man_limit=0,
        #     num_of_woman_limit=0,
        # )
        for i in range(THEME_START_TIME, THEME_END_TIME):
            _, _ = ReservationSchedule.objects.get_or_create(
                    calendar_date = obj,
                    time=f"{i}:00",
                )
        
        
        period = self.product_introduce.period

        data = []
        try:
            #TODO 평일권 처리 추가 예정
            allday_option = self.product_options.get(name="평일 종일권")
            # data.append({
            #     "text": "평일 종일권",
            #     "value": f"00:00",
            #     "remain_user": 100
            # })

        except:
            pass

        reservation_schedules = obj.reservation_schedule.filter(time__hour__lt=THEME_END_TIME).order_by('time')
        remain_counts = [get_remain_count(obj.product_category, x) for x in reservation_schedules]

        for i, x in enumerate(reservation_schedules):
            start_time = x.time.hour
            end_time = start_time + period if start_time + period <= THEME_END_TIME else THEME_END_TIME
            data.append({
                "text": f"{start_time}:00 ~ {end_time}:00",
                "value": f"{start_time}:00",
                #TODO 특정 시간의 잔여 인원이 아닌 시간대의 잔여 인원 중 가장 작은 수 리턴해주도록
                "remain_user": get_remain_count_with_time(remain_counts, i, i+end_time - start_time)
            })

        return data

    def get_product_option(self, obj):
        product_option = self.product_options.filter(name="평일, 주말").first()
        if product_option:
            self.product_option = product_option
            return product_option.id

        try:
            weekday = obj.date.weekday()
        except:
            weekday = datetime.strptime(obj.date, "%Y-%m-%d").weekday()

        if weekday < 5: # 선택한 날짜가 평일이라면
            self.product_option = self.product_options.get(name="평일")

        else: # 주말이거나 (예정)공휴일이라면
            self.product_option = self.product_options.get(name="주말")

        return self.product_option.id

    def get_amount(self, obj):
        return self.product_option.value

    def get_introduce(self, obj):
        data = ProductIntroduceSerializer(self.product_introduce).data
        price = " / ".join([f"{info[0]} {format(int(info[1]), ',') if isinstance(info[1], int) else '-'}" for info in self.product_info.get_children().values_list('name', 'value')])
        data.update({"price": price})
        data.update({"product_title": obj.product_category.parent.name})
        data.update({"product_info": self.product_info.name})
        data.update({"is_gender_union": not bool(obj.product_category.num_of_woman_limit)})
        return data


class ReservationProductsSerializer(serializers.ModelSerializer):
    minimum_price = serializers.SerializerMethodField(read_only=True)
    image = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = ProductInfo
        fields = ['id', 'name', 'minimum_price', 'image', ]
        
    def get_minimum_price(self, obj):
        prices = list(obj.get_children().values_list('name', 'value'))
        min_price = sorted([x for x in prices if x[1].isdigit()], key=lambda x: int(x[1]))[0]
        return list(min_price)
    
    def get_image(self, obj):
        try:
            return obj.productintroduce.image.url
        except:
            return ""


class ReservationSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField(read_only=True)
    reservation_date = serializers.SerializerMethodField(read_only=True)
    reservation_time = serializers.SerializerMethodField(read_only=True)
    product = serializers.SerializerMethodField(read_only=True)
    # fullname = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Reservation
        fields = ['id', 'user', 'fullname', 'num_of_man', 'num_of_woman',
                  'start_time', 'calendar_date', 'product_option', 'product', 'amount',
                  'reservation_at', 'status', 'reservation_date', 'reservation_time']
        
        extra_kwargs = {
            'calendar_date': {
                'write_only': True,
            },
            'product_option': {
                'write_only': True,
            },
            'user': {
                'write_only': True,
            },
            'period': {
                'write_only': True,
            },
            'num_of_man': {
                'required': True,
            },
            'num_of_woman': {
                'required': True,
            },
            'calendar_date': {
                'required': True,
            },
            'product_option': {
                'required': True,
            },
            'amount': {
                'required': False,
            },
            'fullname': {
                'required': False,
            },
            'phone': {
                'required': False,
            },
        }
    
    def __init__(self, *args, **kwargs):
        self.amount = 0
                
        return super().__init__(*args, **kwargs)

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)
        
    def get_status(self, obj):
        return dict(obj.STATUSES).get(obj.status, '')
    
    def get_reservation_date(self, obj):
        if obj.calendar_date:
            return obj.calendar_date.date
        else:
            return None
    
    def get_reservation_time(self, obj):
        start_hour = obj.start_time.hour
        period = obj.product_option.parent.productintroduce.period
        
        if start_hour == 0:
            return f"{THEME_START_TIME}:00 ~ {THEME_END_TIME}:00"
        
        return f"{start_hour}:00 ~ {start_hour+period}:00"
    
    def get_product(self, obj):
        product_category = obj.product_option.parent
        return f"{product_category.parent} - {product_category}"
    
    # def get_fullname(self, obj):
    #     return obj.user.fullname
        
    def validate(self, attrs):
        if self.instance:
            product_option = self.instance.product_option
            num_of_man = self.instance.num_of_man
            num_of_woman = self.instance.num_of_woman
            
            if self.instance.calendar_date.date >= (datetime.now() - timedelta(days=2)).date():
                raise serializers.ValidationError({"error": "예약 일자 2일 전에는 수정하거나 변경할 수 없습니다. 관리자에게 문의해주세요."})
            
            if self.instance.start_time == time(0, 0) and attrs["start_time"] != time(0, 0) or \
               self.instance.start_time != time(0, 0) and attrs["start_time"] == time(0, 0):
                raise serializers.ValidationError({"error": "예약 변경시 차액이 발생합니다. 취소 후 다시 결제해주세요."})
            
        else:
            product_option = attrs['product_option']
            num_of_man = attrs['num_of_man']
            num_of_woman = attrs['num_of_woman']
            
        if product_option.parent.name == '일반수영':
            current_month = datetime.now().month
            
            if '평일' in product_option.name:
                weekly_swim_reservation, _ = SwimReservationManagement.objects.get_or_create(
                    month=current_month,
                    type='weekly'
                )
                if weekly_swim_reservation.swim_remain_count() < 1:
                    raise serializers.ValidationError({"error": "평일 수영장 이용 가능 인원이 초가됐습니다."})
                
            if '주말' in product_option.name:
                weekend_swim_reservation, _ = SwimReservationManagement.objects.get_or_create(
                    month=current_month,
                    type='weekend'
                )
                if weekend_swim_reservation.swim_remain_count() < 1:
                    raise serializers.ValidationError({"error": "주말 수영장 이용 가능 인원이 초가됐습니다."})
                
            return attrs
        
        product_category = attrs['calendar_date'].product_category
        
        if product_category != product_option.parent.parent:
            raise serializers.ValidationError({"error": "잘못된 접근입니다."})
        if attrs['start_time'].hour == 0:
            self.reservation_times = [f'{THEME_START_TIME + x}:00' for x in range(THEME_END_TIME-THEME_START_TIME+1) if THEME_START_TIME + x <= THEME_END_TIME]
        else:
            if attrs['start_time'].hour < THEME_START_TIME:
                raise serializers.ValidationError({"error": f"{THEME_START_TIME}시부터 예약 가능합니다."})
            if attrs['start_time'].hour >= THEME_END_TIME:
                raise serializers.ValidationError({"error": f"{THEME_END_TIME}시까지 예약 가능합니다."})
        
            start_hour = attrs['start_time'].hour
            use_time = product_option.parent.productintroduce.period
            # use_time = 4 if "잠수풀" in product_category.name else 1
            self.reservation_times = [f'{start_hour + x}:00' for x in range(use_time) if start_hour + x <= THEME_END_TIME]

        self.reservation_schedule_list = []

        for reservation_time in self.reservation_times:
            reservation_schedule, _ = ReservationSchedule.objects.get_or_create(
                calendar_date = attrs['calendar_date'],
                time=reservation_time,
            )
            
            remain_count = get_remain_count(product_category, reservation_schedule)
            if isinstance(remain_count, int):
                if remain_count - (num_of_man+num_of_woman) < 0:
                    raise serializers.ValidationError({"error": f"{product_category.name} 이용 가능 인원이 초가됐습니다."})
                
            else:
                if remain_count['man'] - num_of_man < 0 or \
                   remain_count['woman'] - num_of_woman < 0:
                    raise serializers.ValidationError({"error": f"{product_category.name} 이용 가능 인원이 초가됐습니다."})
                
            self.reservation_schedule_list.append(reservation_schedule)

        self.amount = int(product_option.value) * (num_of_man + num_of_woman)
        return attrs
        
    def create(self, validated_data):
        product_option = validated_data['product_option']
        product_introduce = product_option.parent.productintroduce

        validated_data['user_id'] = self.context['request'].user.id
        # validated_data['period'] = product_introduce.period

        instance = super().create(validated_data)
        instance.amount = self.amount
        instance.save()
        
        if product_option.parent.name == '일반수영':
            current_month = datetime.now().month
            if '평일' in product_option.name:
                weekly_swim_reservation, _ = SwimReservationManagement.objects.get_or_create(
                    month=current_month,
                    type='weekly'
                )
                weekly_swim_reservation.total_num_people += 1
                weekly_swim_reservation.save()
                
            if '주말' in product_option.name:
                weekend_swim_reservation, _ = SwimReservationManagement.objects.get_or_create(
                    month=current_month,
                    type='weekend'
                )
                weekend_swim_reservation.total_num_people += 1
                weekly_swim_reservation.save()
            
        else:
            for reservation_schedule in self.reservation_schedule_list:
                reservation_schedule.total_num_of_man += instance.num_of_man
                reservation_schedule.total_num_of_woman += instance.num_of_woman
                reservation_schedule.save()
            instance.reservation_schedule.add(*self.reservation_schedule_list)
        
        return instance
    
    def update(self, instance, validated_data):
        product_option = instance.product_option
        # product_introduce = product_option.parent.productintroduce
        
        # validated_data['user_id'] = self.context['request'].user.id
        # validated_data['period'] = product_introduce.period

        # instance = super().create(validated_data)
        
        if product_option.parent.name == '일반수영':
            pass
            
        else:
            for reservation_schedule in self.reservation_schedule_list:
                reservation_schedule.total_num_of_man += instance.num_of_man
                reservation_schedule.total_num_of_woman += instance.num_of_woman
                reservation_schedule.save()
            for reservation_schedule in instance.reservation_schedule.all():
                reservation_schedule.total_num_of_man -= instance.num_of_man
                reservation_schedule.total_num_of_woman -= instance.num_of_woman
                reservation_schedule.save()
        
        instance = super().update(instance, validated_data)
        return instance
        # instance.status = "cancel"
        # instance.save()
        
class ReservationUpdateSerializer(serializers.ModelSerializer):
    pass

class ReservationScheduleSerializer(serializers.ModelSerializer):
    pass