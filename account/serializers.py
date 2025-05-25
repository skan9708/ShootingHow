from django.contrib.auth import update_session_auth_hash

from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from account.models import User, UserLicense, Terms

class UserLicenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserLicense
        fields = ['user', 'image']
        extra_kwargs = {
            'user': {
                'required': False,
                'write_only': True,
            },
        }

class UserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()
    licenses = UserLicenseSerializer(many=True, required=False)
    
    class Meta:
        model = User
        fields = [
            'email', 'password', 'fullname',
            'phone', 'kakao', 'join_date',
            'role', 'birthday', 'licenses',
        ]

        extra_kwargs = {
            'kakao': {
                'required': False,
                'write_only': True,
            },
            'password': {
                'write_only': True,
                'error_messages': {
                    'blank': '비밀번호를 입력해주세요.',
                    'required': '비밀번호를 입력해주세요.',
                },
            },
            # 'email': {
            #     'error_messages': {
            #         'blank': '이메일을 입력해주세요.',
            #         'required': '이메일을 입력해주세요.',
            #         'invalid': '알맞은 형식의 이메일을 입력해주세요.'
            #     },
            # },
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
            'birthday': {
                'error_messages': {
                    'blank': '생년월일을 입력해주세요.',
                    'required': '생년월일을 입력해주세요.',
                },
            },
        }
    
    def get_role(self, obj):
        return {
            'id': obj.role,
            'text': dict(obj.ROLES)[obj.role]
        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()

        return user
    
    def update(self, instance, validated_data):
        licenses = validated_data.pop('licenses')
        instance.licenses.all().delete()
        
        licenses = [UserLicense(image=img['image'], user=instance) for img in licenses]
        UserLicense.objects.bulk_create(licenses)
        
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

class TermsSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Terms
        fields = ['title', 'content', ]
        read_only_fields = ['title', 'content', ]
