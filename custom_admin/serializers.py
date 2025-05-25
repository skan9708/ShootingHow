import os
import re

from collections import OrderedDict
from datetime import datetime

from django.contrib.auth import update_session_auth_hash
from django.db import transaction

from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from theme.serializers import WritableSerializerMethodField
from theme.utils import send_sms, default_sms_params
from theme import messages
from custom_admin.utils import get_verbose
from account.models import User, UserLicense, Terms
from account.serializers import UserLicenseSerializer

from article.models import (
    Notice, Instructor, InstructorComment, Faq, 
    InstructorAttachment, Inquiry,
    InquiryAttachment, InstructorReport, InquiryReport, 
    InstructorCommentReport,
)
from product.models import (
    ProductInfo, ProductIntroduce, ReservationCalendar,
    ReservationSchedule, Reservation, SwimReservationManagement,
)

from payment.models import (
    OrderID, PaymentHistory,
)

def ends_with_jong(kstr):
    m = re.search("[가-힣]+", kstr)
    if m:
        k = m.group()[-1]
        return (ord(k) - ord("가")) % 28 > 0
    else:
        return
    
def ul(kstr):
    end = "을" if ends_with_jong(kstr) else "를"
    return f'{kstr}{end}'

def yi(kstr):
    end = "이" if ends_with_jong(kstr) else "가"
    return f'{kstr}{end}'

def wa(kstr):
    end = "과" if ends_with_jong(kstr) else "와"
    return f'{kstr}{end}'

def en(kstr):
    end = "은" if ends_with_jong(kstr) else "는"
    return f'{kstr}{end}'
    

def get_row_property(data, field_property):
    row = []
    
    for key, value in data.items():
        row.append((value, field_property.get(key)))

    return row

def get_detail_property(data, fields_property, model):
    for field, value in data.items():
        property_ = fields_property.get(field, {}).copy()
        property_['value'] = value
        
        data[field] = property_
        
    return data

def get_create_property(data, fields_property, model):
    for field in data:
        property_ = fields_property.get(field, {}).copy()
        property_['placeholder'] = f'{field} 입력'
        
        data[field] = property_
        
    return data
    
def set_default_property(field_property, default_settings, model=None):
    default_settings.setdefault('verbose', True)
    
    # 특정 key에 대한 템플릿 지정
    template = {
        'verbose': lambda model, field, property_: property_.get('verbose') or getattr(model, field).field.verbose_name,
        'placeholder': lambda model, field, property_: f'{property_.get("verbose")} 입력' 
                                                       if property_.get("verbose")
                                                       else f'{getattr(model, field).field.verbose_name} 입력',
        'choices': lambda model, field, property_: property_.get('choices') 
                                                   if isinstance(property_.get('choices'), dict) 
                                                   else {value: verbose for value, verbose in getattr(model, field).field.choices},
    }
    
    for field, property_ in field_property.items():
        if property_.get('no_input'):
            continue
        
        for key, value in property_.items():
            value = template[key](model, field, property_) if key in template.keys() else value
            property_[key] = value
            
        for key, value in default_settings.items():
            # 특정 key가 템플릿에 존재 할 경우 해당 값으로 입력
            value = template[key](model, field, property_) if key in template.keys() else value
            property_.setdefault(key, value)

def instructor_request_send_sms(user):
    params = default_sms_params.copy()
    replace_dict = {
        "$(고객명)": user.fullname,
        #TODO 페이지주소 수정 필요
        "$(페이지주소)": "k-sports.com",
    }
    
    message = messages.INSTRUCTOR_SUCCESS_MESSAGE
    
    for key, value in replace_dict.items():
        message = message.replace(key, value)
    
    params[f'rec_1'] = user.phone
    params[f'msg_1'] = message
    send_sms(params)
            
class TermsListAdminSerializer(serializers.ModelSerializer):
    '''이용약관 페이지'''
    class Meta:
        model = Terms
        fields_property = {
            'type': {}, 
            'title': {}, 
            'content': {},
        }
        
        read_only_fields = ['type']
        
        set_default_property(
            field_property=fields_property,
            default_settings={
                'class': '',
                'type': 'text',
                'read_only': '',
            },
            model=model
        )
        
        fields = tuple(fields_property.keys())

    def to_representation(self, instance):
        data = super().to_representation(instance)
        fields_property = self.Meta.fields_property
        model = self.Meta.model
        data = get_detail_property(data=data, fields_property=fields_property, model=model)
        data['pk'] = instance.pk
        
        return data

class UserListAdminSerializer(serializers.ModelSerializer):
    '''유저 리스트 페이지'''
    birthday = serializers.SerializerMethodField()
    join_date = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields_property = {
            'member_num': {}, 
            'fullname': {}, 
            'phone': {}, 
            'birthday': {},
            'join_date': {},
            'role': {},
            'join_type': {'class': 'center'},
        }
        
        set_default_property(
            field_property=fields_property,
            default_settings={
                'class': '',
                'verbose': True
            },
            model=model,
        )
        
        fields = tuple(fields_property.keys())
        display_fields = {v['verbose']: v.get('display', {}) for v in fields_property.values()}
        
    def get_birthday(self, obj):
        return obj.birthday.strftime('%Y-%m-%d')
    
    def get_join_date(self, obj):
        return obj.join_date.strftime('%Y-%m-%d %H:%M:%S')
    
    def get_role(self, obj):
        return obj.get_role_display()
    
    def to_representation(self, instance):
        data = super().to_representation(instance)

        result = {
            'pk': instance.pk,
            'data': get_row_property(data, self.Meta.fields_property),
        }
        
        return result
    
class UserDetailAdminSerializer(serializers.ModelSerializer):
    '''유저 디테일 페이지'''
    birthday = WritableSerializerMethodField()
    join_date = serializers.SerializerMethodField()
    # role = WritableSerializerMethodField()
    licenses = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields_property = {
            'member_num': {'read_only': True, }, 
            'join_type': {'read_only': True, },
            'fullname': {}, 
            'phone': {'read_only': True, }, 
            'birthday': {'type': 'date', }, 
            'role': {'choices': True},
            'licenses': {'list': True},
            'instructor_expired_date': {'type': 'date', }, 
            'instructor_register_date': {'type': 'date', 'read_only': True, }, 
            'join_date': {'read_only': True, },
            'memo': {},
        }
        
        extra_kwargs = {'role': {'required': True},}
        
        read_only_fields = ['join_type']
        
        set_default_property(
            field_property=fields_property,
            default_settings={
                'class': '',
                'type': 'text',
            },
            model=model
        )
        
        fields = tuple(fields_property.keys())

    def get_birthday(self, obj):
        return obj.birthday.strftime('%Y-%m-%d')
    
    def get_join_date(self, obj):
        return obj.join_date.strftime('%Y-%m-%d %H:%M:%S')
    
    # def get_role(self, obj):
    #     return obj.get_role_display()
    
    def get_licenses(self, obj):
        licenses = obj.licenses.all()
        # [(filename, url), ...] 형태
        return [(os.path.basename(obj.image.name), obj.image.url) for obj in licenses]
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        fields_property = self.Meta.fields_property
        model = self.Meta.model
        data = get_detail_property(data=data, fields_property=fields_property, model=model)
        
        return data
    
class UserAdminSerializer(serializers.ModelSerializer):
    '''유저 생성 페이지 / 생성 / 수정'''
    check_password = serializers.CharField(write_only=True, required=False)
    licenses = UserLicenseSerializer(many=True, required=False)
    
    class Meta:
        model = User
        fields_property = {
            'fullname': {}, 
            'password': {'type': 'password'}, 
            'check_password': {'verbose': '비밀번호 확인', 'type': 'password'}, 
            'licenses': {'no_input': True}, 
            'instructor_expired_date': {'no_input': True}, 
            'phone': {}, 
            'birthday': {'type': 'date'}, 
            'role': {'choices': True},
            'memo': {'class': ''},
        }
        
        set_default_property(
            field_property=fields_property,
            default_settings={
                'type': 'text',
                'class': 'required',
                'placeholder': True,
            },
            model=model
        )
        
        fields = tuple(fields_property.keys())

        extra_kwargs = {
            'memo': {
                'required': False,
            },
            'instructor_expired_date': {
                'required': False,
            },
        }
        for field, property_ in fields_property.items():
            if property_.get('no_input'):
                continue
            
            extra_kwargs.setdefault(field, {})
            extra_kwargs[field]['error_messages'] = {
                'blank': f'{ul(property_["verbose"])} 입력해주세요.',
                'required': f'{ul(property_["verbose"])} 입력해주세요.',
                'invalid': f'{ul(property_["verbose"])} 입력해주세요.'
            }
    
    def validate(self, attrs):
        if attrs['role'] != 'normal':
            if not attrs.get('licenses'):
                raise serializers.ValidationError({"error": "라이센스를 첨부해주세요."})
            
        if attrs['role'] in ['registered_instructor', 'responsible_instructor']:
            if not attrs.get('instructor_expired_date'):
                raise serializers.ValidationError({"error": "강사 회원 만료일을 설정해주세요."})
                
        if self.context['request'].method == 'POST':
            if attrs['password'] != attrs.get('check_password'):
                raise serializers.ValidationError({"error": "비밀번호 확인이 일치하지 않습니다."})
        
        return super().validate(attrs)
    
    @transaction.atomic()
    def create(self, validated_data):
        password = validated_data.pop('password')
        validated_data.pop('check_password')
        licenses = validated_data.pop('licenses')

        user = User(**validated_data)
        
        if user.role not in ['normal', 'waiting_instructor_request']:
            if not user.instructor_register_date:
                user.instructor_register_date = datetime.now()
            
        user.set_password(password)
        user.save()
        
        licenses = [UserLicense(image=x['image'], user=user) for x in licenses]
        UserLicense.objects.bulk_create(licenses)

        return user
    
    @transaction.atomic()
    def update(self, instance, validated_data):
        licenses = validated_data.pop('licenses')
        
        for key, value in validated_data.items():
            if key == 'password':
                instance.set_password(value)
                update_session_auth_hash(self.context.get('request'), instance)
                continue
            
            if key == 'phone':
                continue
            
            setattr(instance, key, value)
            
        previous_licenses = [(obj, os.path.basename(obj.image.name)) for obj in UserLicense.objects.filter(user=instance)]
        uploaded_licenses = [(license_, license_['image'].name) for license_ in licenses]
        
        # 기존에 존재하지만 없로드 된 파일 목록에 없는 이미지 삭제
        [obj.delete() for obj, name in previous_licenses if name not in [x[1] for x in uploaded_licenses]]
        
        # 업로드 된 파일 목록 중 기존 존재하는 파일 이름은 제외
        licenses = [UserLicense(image=img['image'], user=instance) for img, name in uploaded_licenses 
                    if name not in [x[1] for x in previous_licenses]]
        
        if instance.role not in ['normal', 'waiting_instructor_request']:
            if not instance.instructor_register_date:
                instance.instructor_register_date = datetime.now()
        
                
        if instance.role == 'instructor':
            instructor_request_send_sms(instance)
        
        UserLicense.objects.bulk_create(licenses)
        instance.save()
        
        return instance
    
class StaffListAdminSerializer(serializers.ModelSerializer):
    '''관리자 리스트 페이지'''
    join_date = serializers.SerializerMethodField()
    is_superuser = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields_property = {
            # 'member_num': {}, 
            'phone': {}, 
            'fullname': {},
            'is_superuser': {'verbose': '관리자 유형'},
            'join_date': {},
        }
        
        set_default_property(
            field_property=fields_property,
            default_settings={
                'class': '',
                'verbose': True
            },
            model=model,
        )
        
        fields = tuple(fields_property.keys())
        display_fields = {v['verbose']: v.get('display', {}) for v in fields_property.values()}
        
    def get_join_date(self, obj):
        return obj.join_date.strftime('%Y-%m-%d %H:%M:%S')
    
    def get_is_superuser(self, obj):
        return '관리자' if obj.is_superuser else '부관리자'
    
    def to_representation(self, instance):
        data = super().to_representation(instance)

        result = {
            'pk': instance.pk,
            'data': get_row_property(data, self.Meta.fields_property),
        }
        
        return result
    
class StaffDetailAdminSerializer(serializers.ModelSerializer):
    '''관리자 디테일 페이지'''
    
    class Meta:
        model = User
        fields_property = {
            'phone': {'read_only': True, },
            'is_superuser': {'choices': {True: '관리자', False: '부관리자'}},
            'fullname': {}, 
            # 'password': {'type': 'password'}, 
            # 'check_password': {'verbose': '비밀번호 확인', 'type': 'password'},
        }
        
        extra_kwargs = {'role': {'required': True},}
        
        read_only_fields = ['join_type']
        
        set_default_property(
            field_property=fields_property,
            default_settings={
                'class': '',
                'type': 'text',
            },
            model=model
        )
        
        fields = tuple(fields_property.keys())

    def to_representation(self, instance):
        data = super().to_representation(instance)
        fields_property = self.Meta.fields_property
        model = self.Meta.model
        data = get_detail_property(data=data, fields_property=fields_property, model=model)
        
        return data
    
class StaffAdminSerializer(serializers.ModelSerializer):
    '''관리자 생성 페이지 / 생성 / 수정'''
    check_password = serializers.CharField(
        write_only=True, required=False,
        error_messages={
            'blank': '비밀번호 확인을 입력해주세요.',
            'required': '비밀번호 확인을 입력해주세요.',
            'invalid': '비밀번호 확인을 입력해주세요.',
        }
    )
    
    class Meta:
        model = User
        fields_property = {
            'phone': {}, 
            'fullname': {},
            'is_superuser': {'choices': {True: '관리자', False: '부관리자'}},
            'password': {'type': 'password'}, 
            'check_password': {'verbose': '비밀번호 확인', 'type': 'password'}, 
        }
        
        set_default_property(
            field_property=fields_property,
            default_settings={
                'type': 'text',
                'class': 'required',
                'placeholder': True,
            },
            model=model
        )
        
        fields = tuple(fields_property.keys())

        extra_kwargs = {
            'memo': {
                'required': False,
            },
            'instructor_expired_date': {
                'required': False,
            },
        }
        for field, property_ in fields_property.items():
            if property_.get('no_input'):
                continue
            
            extra_kwargs.setdefault(field, {})
            if property_.get('choices'):
                extra_kwargs[field]['error_messages'] = {
                    'blank': f'{ul(property_["verbose"])} 선택해주세요.',
                    'required': f'{ul(property_["verbose"])} 선택해주세요.',
                    'invalid': f'{ul(property_["verbose"])} 선택해주세요.'
                }
            else:
                extra_kwargs[field]['error_messages'] = {
                    'blank': f'{ul(property_["verbose"])} 입력해주세요.',
                    'required': f'{ul(property_["verbose"])} 입력해주세요.',
                    'invalid': f'{ul(property_["verbose"])} 입력해주세요.'
                }
                
    def validate(self, attrs):
        staff_count = User.objects.filter(is_active=True, is_staff=True, is_superuser=False).count()
        if not attrs['is_superuser'] and staff_count >= 5:
            raise serializers.ValidationError({"error": "부관리자는 최대 5명까지 생성할 수 있습니다."})
        
        if self.context['request'].method == 'POST':
            if attrs['password'] != attrs.get('check_password'):
                raise serializers.ValidationError({"error": "비밀번호 확인이 일치하지 않습니다."})
        
        return super().validate(attrs)
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        validated_data.pop('check_password')

        user = User(**validated_data)
        user.is_staff = True
        
        user.set_password(password)
        user.save()
        
        return user
    
    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            if key == 'password':
                instance.set_password(value)
                update_session_auth_hash(self.context.get('request'), instance)
                continue
            
            if key == 'phone':
                continue
            
            setattr(instance, key, value)
        
        instance.save()
        
        return instance

class ProductInfoAdminSerializer(serializers.ModelSerializer):
    # product_id = serializers.SerializerMethodField()
    header = serializers.SerializerMethodField()
    value = WritableSerializerMethodField()
    child = serializers.SerializerMethodField()

    class Meta:
        model = ProductInfo
        fields = ['id', 'name', 'header', 'value', 'child']

    # def get_product_id(self, obj):
    #     if obj.level == 2:
    #         return obj.id
    #     return None
    
    def get_header(self, obj):
        if obj.level == 1:
            childs_of_child = obj.get_children().first().get_children()
            return '|'.join([x for x in childs_of_child.values_list('name', flat=True)])
            # return childs_of_child.values_list('name', flat=True)
        return None
    
    def get_value(self, obj):
        if obj.level == 2:
            return [(pk, name, value) for pk, name, value in obj.get_children().values_list('pk', 'name', 'value')]
            # return obj.get_children().values_list('value', flat=True)
        return None
    
    def get_child(self, obj):
        # child node를 재귀적으로 돌면서 tree 생성
        if obj.level < 2:
            return ProductInfoAdminSerializer(obj.get_children(), many=True).data
        return None
    
    # 값이 null인 필드 삭제
    def to_representation(self, instance):
        result = super().to_representation(instance)
        # return OrderedDict([(key, result[key]) for key in result if result[key]])
        return {key: result[key] for key in result if result[key]}
    
    def update(self, instance, validated_data):
        print(validated_data)
        return super().update(instance, validated_data)

class ReservationListAdminSerializer(serializers.ModelSerializer):
    '''예약 리스트 페이지'''
    # birthday = serializers.SerializerMethodField()
    # join_date = serializers.SerializerMethodField()
    product_option = serializers.SerializerMethodField()
    calendar_date = serializers.SerializerMethodField()
    product_info = {}
    
    class Meta:
        model = Reservation
        fields_property = {
            'reservation_code': {}, 
            'fullname': {}, 
            'product_option': {}, 
            'reservation_status': {},
            'calendar_date': {'type': 'data', },
            'memo': {},
        }
        
        set_default_property(
            field_property=fields_property,
            default_settings={
                'class': '',
                'verbose': True
            },
            model=model,
        )
        
        fields = tuple(fields_property.keys())
        display_fields = {v['verbose']: v.get('display', {}) for v in fields_property.values()}
    
    def get_calendar_date(self, obj):
        return obj.calendar_date.date
    
    def get_product_option(self, obj):
        parent_name = self.product_info.get(obj.product_option.id)
        if not parent_name:
            parent_name = obj.product_option.parent.name
            self.product_info[obj.product_option.id] = parent_name
            
        return f'{parent_name} - {obj.product_option.name}'
    
    def to_representation(self, instance):
        data = super().to_representation(instance)

        result = {
            'pk': instance.pk,
            'data': get_row_property(data, self.Meta.fields_property),
        }
        
        return result
    
class PaymentHistorySerializer(serializers.ModelSerializer):
    pass
    class Meta:
        model = PaymentHistory
        fields = ()

class ReservationDetailAdminSerializer(serializers.ModelSerializer):
    '''예약 디테일 페이지'''
    product_option = serializers.SerializerMethodField()
    calendar_date = serializers.SerializerMethodField()
    reservation_status = serializers.SerializerMethodField()
    reservation_schedule = serializers.SerializerMethodField()
    num_of_user = serializers.SerializerMethodField()
    reservation_at = serializers.SerializerMethodField()
        
    class Meta:
        model = Reservation
        fields_property = {
            'reservation_code': {}, 
            'reservation_status': {},
            'fullname': {}, 
            'product_option': {}, 
            'calendar_date': {'type': 'date', }, 
            'reservation_schedule': {},
            'num_of_user': {'verbose': '이용 인원'},
            'reservation_at': {'type': 'datetime-local'}, 
            
            # payment_info
            # 'instructor_register_date': {'type': 'date', 'read_only': True, }, 
            # 'join_date': {'read_only': True, },
            
            'memo': {'read_only': ''},
        }
        
        extra_kwargs = {'role': {'required': True},}
        
        read_only_fields = ['join_type']
        
        set_default_property(
            field_property=fields_property,
            default_settings={
                'class': '',
                'type': 'text',
                'read_only': 'readonly',
            },
            model=model
        )
        
        fields = tuple(fields_property.keys())

    def get_calendar_date(self, obj):
        return obj.calendar_date.date.strftime('%Y-%m-%d')
    
    def get_product_option(self, obj):
        return obj.get_product_name()
    
    def get_reservation_status(self, obj):
        return obj.get_reservation_status_display()
    
    def get_reservation_schedule(self, obj):
        return obj.get_usage_time()
    
    def get_num_of_user(self, obj):
        return obj.get_num_of_user()
    
    def get_reservation_at(self, obj):
        return obj.reservation_at.strftime('%Y-%m-%d %H:%M:%S')
        # return obj.reservation_at.date.strftime('%Y-%m-%d')
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        fields_property = self.Meta.fields_property
        model = self.Meta.model
        data = get_detail_property(data=data, fields_property=fields_property, model=model)
        
        return data
    
class InquiryListAdminSerializer(serializers.ModelSerializer):
    '''문의 리스트 페이지'''
    author = serializers.SerializerMethodField()
    is_answer = serializers.SerializerMethodField()
    created = serializers.SerializerMethodField()
    
    class Meta:
        model = Inquiry
        fields_property = {
            'title': {'display': {'class': 'ellipsis'}},
            'author': {}, 
            'is_answer': {'verbose': '답변여부'}, 
            'created': {}, 
            # 'comments': {},
        }
        
        set_default_property(
            field_property=fields_property,
            default_settings={
                'class': '',
            },
            model=model
        )
        
        fields = tuple(fields_property.keys())
        display_fields = {v['verbose']: v.get('display', {}) for v in fields_property.values()}
        
    def get_author(self, obj):
        return obj.author.fullname
    
    def get_is_answer(self, obj):
        return '답변완료' if obj.answer else '답변전'
    
    def get_created(self, obj):
        return obj.created.strftime('%Y-%m-%d')
    
    def to_representation(self, instance):
        data = super().to_representation(instance)

        result = {
            'pk': instance.pk,
            'data': get_row_property(data, self.Meta.fields_property),
        }
        
        return result
    
# class InquiryCommentAdminSerializer(serializers.ModelSerializer):
#     author = WritableSerializerMethodField()
#     created = serializers.SerializerMethodField()

#     class Meta:
#         model = InquiryComment
#         fields_property = {
#             'article': {}, 
#             'author': {}, 
#             'content': {}, 
#             'created': {}, 
#         }
        
#         set_default_property(
#             field_property=fields_property,
#             default_settings={
#             },
#             model=model
#         )
        
#         fields = tuple(fields_property.keys())
        
#         extra_kwargs = {
#             'article': {'write_only': True, 'required': True},
#             'author': {'required': True},
#         }
        
#         for field, property_ in fields_property.items():
#             if property_.get('no_input'):
#                 continue
            
#             extra_kwargs.setdefault(field, {})
#             extra_kwargs[field]['error_messages'] = {
#                 'blank': f'{ul(property_["verbose"])} 입력해주세요.',
#                 'required': f'{ul(property_["verbose"])} 입력해주세요.',
#                 'invalid': f'{ul(property_["verbose"])} 입력해주세요.'
#             }
    
#     def get_author(self, obj):
#         return obj.author.fullname
    
#     def get_created(self, obj):
#         return obj.created.strftime('%Y-%m-%d')
        
#     def to_representation(self, instance):
#         data = super().to_representation(instance)
        
#         return [x for x in data.values()]
    
class InquiryDetailAdminSerializer(serializers.ModelSerializer):
    '''문의 디테일 페이지'''
    author = serializers.SerializerMethodField()
    created = serializers.SerializerMethodField()
    attachments = serializers.SerializerMethodField()
    # comments = InquiryCommentAdminSerializer(source='inquirycomment_set', many=True)

    class Meta:
        model = Inquiry
        fields_property = {
            'author': {}, 
            'created': {},
            
            'title': {}, 
            'content': {},
            'attachments': {'list': True, 'verbose': '첨부파일'},
            
            'answer': {}
            # 'comments': {'type': 'date', 'verbose': '댓글'}, 
        }
        
        extra_kwargs = {'role': {'required': True},}
        
        read_only_fields = ['join_type']
        
        set_default_property(
            field_property=fields_property,
            default_settings={
                'class': '',
                'type': 'text',
                'read_only': 'readonly',
            },
            model=model
        )
        
        fields = tuple(fields_property.keys())

    def get_author(self, obj):
        return obj.author.fullname
    
    def get_created(self, obj):
        return obj.created.strftime('%Y-%m-%d')
    
    def get_attachments(self, obj):
        attachments = obj.inquiryattachment_set.all()
        return [(os.path.basename(obj.attachment.name), 
               f'{os.path.dirname(obj.attachment.url)}/{obj.id}/') for obj in attachments]
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        fields_property = self.Meta.fields_property
        model = self.Meta.model
        data = get_detail_property(data=data, fields_property=fields_property, model=model)
        
        return data
    
class InstructorListAdminSerializer(serializers.ModelSerializer):
    '''강사게시판 리스트 페이지'''
    author = serializers.SerializerMethodField()
    created = serializers.SerializerMethodField()
    is_visible = serializers.SerializerMethodField()
    
    class Meta:
        model = Instructor
        fields_property = {
            'title': {'display': {'class': 'ellipsis'}}, 
            'author': {}, 
            'is_visible': {}, 
            'created': {}, 
        }
        
        set_default_property(
            field_property=fields_property,
            default_settings={
                'class': '',
            },
            model=model
        )
        
        fields = tuple(fields_property.keys())
        display_fields = {v['verbose']: v.get('display', {}) for v in fields_property.values()}
        
    def get_author(self, obj):
        return obj.author.fullname
    
    def get_created(self, obj):
        return obj.created.strftime('%Y-%m-%d')
    
    def get_is_visible(self, obj):
        return '공개' if obj.is_visible else '비공개'
    
    def to_representation(self, instance):
        data = super().to_representation(instance)

        result = {
            'pk': instance.pk,
            'data': get_row_property(data, self.Meta.fields_property),
        }
        
        return result
    
class InstructorCommentAdminSerializer(serializers.ModelSerializer):
    author = WritableSerializerMethodField()
    created = serializers.SerializerMethodField()

    class Meta:
        model = InstructorComment
        fields_property = {
            'article': {}, 
            'author': {}, 
            'content': {}, 
            'created': {}, 
        }
        
        set_default_property(
            field_property=fields_property,
            default_settings={
            },
            model=model
        )
        
        fields = tuple(fields_property.keys())
        
        extra_kwargs = {
            'article': {'write_only': True, 'required': True},
            'author': {'required': True},
        }
        
        for field, property_ in fields_property.items():
            if property_.get('no_input'):
                continue
            
            extra_kwargs.setdefault(field, {})
            extra_kwargs[field]['error_messages'] = {
                'blank': f'{ul(property_["verbose"])} 입력해주세요.',
                'required': f'{ul(property_["verbose"])} 입력해주세요.',
                'invalid': f'{ul(property_["verbose"])} 입력해주세요.'
            }
    
    def get_author(self, obj):
        return obj.author.fullname
    
    def get_created(self, obj):
        return obj.created.strftime('%Y-%m-%d')
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        
        return [x for x in data.values()]
    
class InstructorDetailAdminSerializer(serializers.ModelSerializer):
    '''강사게시판 디테일 페이지'''
    author = serializers.SerializerMethodField()
    created = serializers.SerializerMethodField()
    attachments = serializers.SerializerMethodField()
    # is_visible = WritableSerializerMethodField()

    class Meta:
        model = Instructor
        fields_property = {
            'author': {}, 
            'created': {},
            
            'title': {}, 
            'content': {},
            'attachments': {'list': True, 'verbose': '첨부파일'},
            'is_visible': {}, 
            
        }
        
        extra_kwargs = {'role': {'required': True},}
        
        read_only_fields = ['join_type']
        
        set_default_property(
            field_property=fields_property,
            default_settings={
                'class': '',
                'type': 'text',
                'read_only': 'readonly',
            },
            model=model
        )
        
        fields = tuple(fields_property.keys())

    def get_author(self, obj):
        return obj.author.fullname
    
    def get_created(self, obj):
        return obj.created.strftime('%Y-%m-%d')
    
    def get_attachments(self, obj):
        attachments = obj.instructorattachment_set.all()
        return [(os.path.basename(obj.attachment.name),
                f'{os.path.dirname(obj.attachment.url)}/{obj.id}/') for obj in attachments]
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        fields_property = self.Meta.fields_property
        model = self.Meta.model
        data = get_detail_property(data=data, fields_property=fields_property, model=model)
        
        return data

class CommentSerializer(serializers.Serializer):
    author = serializers.SerializerMethodField()
    article = serializers.SerializerMethodField()
    content = serializers.CharField()
    category = serializers.SerializerMethodField()
    created = serializers.SerializerMethodField()
    
    model = {
        InstructorComment: 'instructor',
        # InquiryComment: 'inquiry',
    }
    
    display_fields = ['작성자', '게시글', '내용', '유형', '작성일자']
    
    def get_author(self, obj):
        return obj.author.fullname
    
    def get_article(self, obj):
        return {
            'pk': obj.article.pk,
            'title': obj.article.title,
        }
        
    def get_category(self, obj):
        return self.model[type(obj)]
    
    def get_created(self, obj):
        return obj.created.strftime('%Y-%m-%d %H:%M:%S')
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['pk'] = instance.pk
        
        return data
    
class ReportSerializer(serializers.Serializer):
    target = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()
    datetime = serializers.SerializerMethodField()
    
    model = {
        InstructorReport: {'url': 'instructor', 'path': 'instructor'},
        InquiryReport: {'url': 'inquiry', 'path': 'inquiry'},
        InstructorCommentReport: {'url': 'comment/instructor', 'path': 'comment_instructor'},
        # InquiryCommentReport: {'url': 'comment/inquiry', 'path': 'comment_inquiry'},
    }

    
    display_fields = ['게시글', '유형', '내용', '작성일자']
    
    def get_user(self, obj):
        return obj.user.fullname
    
    def get_target(self, obj):
        return {
            'pk': obj.target.pk,
            'title': obj.target.title if hasattr(obj.target, 'title') else None,
            'content': obj.target.content,
        }
        
    def get_category(self, obj):
        return self.model[type(obj)]
    
    def get_datetime(self, obj):
        return obj.datetime.strftime('%Y-%m-%d %H:%M:%S')
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['pk'] = instance.pk
        
        return data
    
class FaqListAdminSerializer(serializers.ModelSerializer):
    '''자주묻는질문 리스트 페이지'''
    created = serializers.SerializerMethodField()
    
    class Meta:
        model = Faq
        fields_property = {
            'id': {}, 
            'question': {'display': {'class': 'ellipsis'}}, 
            'order': {}, 
            'created': {}, 
        }
        
        set_default_property(
            field_property=fields_property,
            default_settings={
                'class': '',
            },
            model=model
        )
        
        fields = tuple(fields_property.keys())
        display_fields = {v['verbose']: v.get('display', {}) for v in fields_property.values()}
        
    def get_created(self, obj):
        return obj.created.strftime('%Y-%m-%d')
    
    def to_representation(self, instance):
        data = super().to_representation(instance)

        result = {
            'pk': instance.pk,
            'data': get_row_property(data, self.Meta.fields_property),
        }
        
        return result
    
class FaqDetailAdminSerializer(serializers.ModelSerializer):
    '''자주묻는질문 디테일 페이지'''

    class Meta:
        model = Faq
        fields_property = {
            'order': {}, 
            'question': {}, 
            'answer': {}, 
        }
        
        set_default_property(
            field_property=fields_property,
            default_settings={
                'class': '',
                'type': 'text',
                'read_only': 'readonly',
            },
            model=model
        )
        
        fields = tuple(fields_property.keys())
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        fields_property = self.Meta.fields_property
        model = self.Meta.model
        data = get_detail_property(data=data, fields_property=fields_property, model=model)
        
        return data

class FaqAdminSerializer(serializers.ModelSerializer):
    '''자주 묻는 질문 페이지 / 생성 / 수정'''
    
    class Meta:
        model = Faq
        fields_property = {
            'order': {'class': ''}, 
            'question': {}, 
            'answer': {}, 
        }
        
        set_default_property(
            field_property=fields_property,
            default_settings={
                'type': 'text',
                'class': 'required',
                'placeholder': True,
            },
            model=model
        )
        
        fields = tuple(fields_property.keys())

        extra_kwargs = {}
        
        for field, property_ in fields_property.items():
            if property_.get('no_input'):
                continue
            
            extra_kwargs.setdefault(field, {})
            
            extra_kwargs[field]['error_messages'] = {
                'blank': f'{ul(property_["verbose"])} 입력해주세요.',
                'required': f'{ul(property_["verbose"])} 입력해주세요.',
                'invalid': f'{property_["verbose"]}에 올바르지 않은 값이 입력되었습니다.'
            }
            
            extra_kwargs[field]['required'] = True if 'required' in property_.get('class', '').split(' ') else False

class NoticeListAdminSerializer(serializers.ModelSerializer):
    '''공지사항 리스트 페이지'''
    created = serializers.SerializerMethodField()
    top_fixed = serializers.SerializerMethodField()
    
    class Meta:
        model = Notice
        fields_property = {
            'id': {}, 
            'title': {}, 
            'view_count': {},
            'top_fixed': {},
            'created': {}, 
        }
        
        set_default_property(
            field_property=fields_property,
            default_settings={
                'class': '',
            },
            model=model
        )
        
        fields = tuple(fields_property.keys())
        display_fields = {v['verbose']: v.get('display', {}) for v in fields_property.values()}
        
    def get_created(self, obj):
        return obj.created.strftime('%Y-%m-%d')
    
    def get_top_fixed(self, obj):
        return 'O' if obj.top_fixed else 'X'
    
    def to_representation(self, instance):
        data = super().to_representation(instance)

        result = {
            'pk': instance.pk,
            'data': get_row_property(data, self.Meta.fields_property),
        }
        
        return result
    
class NoticeDetailAdminSerializer(serializers.ModelSerializer):
    '''공지사항 디테일 페이지'''
    attachment = serializers.SerializerMethodField()

    class Meta:
        model = Notice
        fields_property = {
            'top_fixed': {'check': '상단 고정 여부', 'class': ''},
            'title': {}, 
            'content': {'ckeditor': True}, 
            'attachment': {'attachment': True, 'class': ''}, 
        }
        
        set_default_property(
            field_property=fields_property,
            default_settings={
                'class': '',
                'type': 'text',
                'read_only': 'readonly',
            },
            model=model
        )
        
        fields = tuple(fields_property.keys())
        
    def get_attachment(self, obj):
        if obj.attachment:
            return {
                'url': f'{os.path.dirname(obj.attachment.url)}/{obj.id}/',
                'filename': os.path.basename(obj.attachment.name)}
        else:
            return {
                'url': '',
                'filename': ''}
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        fields_property = self.Meta.fields_property
        model = self.Meta.model
        data = get_detail_property(data=data, fields_property=fields_property, model=model)
        
        return data

class NoticeAdminSerializer(serializers.ModelSerializer):
    '''공지사항 생성 페이지 / 생성 / 수정'''
    
    class Meta:
        model = Notice
        fields_property = {
            'top_fixed': {'check': '상단 고정 여부', 'class': ''},
            'title': {}, 
            'content': {}, 
            'attachment': {'attachment': True, 'class': ''}, 
        }
        
        set_default_property(
            field_property=fields_property,
            default_settings={
                'type': 'text',
                'class': 'required',
                'placeholder': True,
            },
            model=model
        )
        
        fields = tuple(fields_property.keys())

        extra_kwargs = {}
        
        for field, property_ in fields_property.items():
            if property_.get('no_input'):
                continue
            
            extra_kwargs.setdefault(field, {})
            
            extra_kwargs[field]['error_messages'] = {
                'blank': f'{ul(property_["verbose"])} 입력해주세요.',
                'required': f'{ul(property_["verbose"])} 입력해주세요.',
                'invalid': f'{property_["verbose"]}에 올바르지 않은 값이 입력되었습니다.'
            }
            
            extra_kwargs[field]['required'] = True if 'required' in property_.get('class', '').split(' ') else False
            