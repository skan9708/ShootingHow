from django.contrib.auth import update_session_auth_hash

from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from account.models import User, Terms

# class UserLicenseSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = UserLicense
#         fields = ['user', 'image']
#         extra_kwargs = {
#             'user': {
#                 'required': False,
#                 'write_only': True,
#             },
#         }

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'userid', 'email', 'password', 'fullname',
            'phone', 'nickname', 'agreed_to_terms', 'join_date',
        ]
        read_only_fields = ['join_date', 'userid'] # userid는 생성 시 자동 할당되므로 읽기 전용

        extra_kwargs = {
            'password': {
                'write_only': True,
                'error_messages': {
                    'blank': '비밀번호를 입력해주세요.',
                    'required': '비밀번호를 입력해주세요.',
                },
            },
            'fullname': {
                'error_messages': {
                    'blank': '이름을 입력해주세요.',
                    'required': '이름을 입력해주세요.',
                },
            },
            'phone': {
                'error_messages': {
                    'blank': '핸드폰번호를 입력해주세요.',
                    'required': '핸드폰번호를 입력해주세요.',
                },
            },
            'nickname': {
                'error_messages': {
                    'blank': '닉네임을 입력해주세요.',
                    'required': '닉네임을 입력해주세요.',
                },
            },
            'agreed_to_terms': {
                 'error_messages': {
                    'required': '개인정보 수집 및 이용에 동의해주세요.',
                },
            }
        }

    def create(self, validated_data):
        # User 모델의 create_user 메소드를 사용하도록 변경
        user = User.objects.create_user(**validated_data)
        return user
    
    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            if key == 'password':
                instance.set_password(value)
                # update_session_auth_hash(self.context.get('request'), instance) # 세션 인증 해시 업데이트는 필요시 주석 해제
                continue
            
            # ফোন নম্বর আপডেট করার অনুমতি না থাকলে
            if key == 'phone': # 휴대폰 번호는 변경 불가로 가정 (필요시 로직 추가)
                continue
            
            setattr(instance, key, value)
            
        instance.save()
        
        return instance

class TermsSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Terms
        fields = ['title', 'content', ]
        read_only_fields = ['title', 'content', ]
