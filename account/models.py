from django.db import models
from django.core.validators import RegexValidator, FileExtensionValidator
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin
import uuid
import time # time 모듈 임포트

ATTACHMENT_ALLOW_EXTENTIONS = ["pdf", "png", "jpg", "jpeg"]

class UserManager(BaseUserManager):
    def create_user(self, email, phone, password=None, fullname=None, nickname=None, agreed_to_terms=False):
        if not email:
            raise ValueError('Users must have an email address')
        if not phone:
            raise ValueError('Users must have an phone')
        
        user = self.model(
            email=self.normalize_email(email),
            phone=phone,
            fullname=fullname,
            nickname=nickname,
            agreed_to_terms=agreed_to_terms,
        )
        user.userid = uuid.uuid4().hex[:10] # userid 임의 생성
        user.member_num = str(int(time.time())) # 유닉스 타임스탬프로 회원번호 설정
        user.set_password(password)
        user.save(using=self._db)
        return user

class User(AbstractBaseUser, PermissionsMixin):
    phone_validator = RegexValidator(regex=r'01[0|1|6|7|8|9]\d{3,4}\d{4}$',
                                     message='올바른 핸드폰 번호를 입력해주세요.',
                                     code='invalid')
    
    userid = models.CharField("아이디", max_length=30, unique=True, editable=False)
    email = models.EmailField("이메일", unique=True, error_messages={'unique': "이미 존재하는 이메일 주소입니다."})
    password = models.CharField("비밀번호", max_length=150)
    fullname = models.CharField("이름", max_length=30)
    phone = models.CharField("핸드폰번호", validators=[phone_validator],
                             unique=True, max_length=20,
                             error_messages={'unique': "이미 존재하는 핸드폰 번호입니다."})
    nickname = models.CharField("닉네임", max_length=30, unique=True, error_messages={'unique': "이미 사용중인 닉네임입니다."})
    agreed_to_terms = models.BooleanField("개인정보동의여부", default=False)
    join_date = models.DateTimeField("가입일", auto_now_add=True)
    member_num = models.CharField("회원번호", max_length=30, unique=True, blank=True) # unique=True 추가, blank=True 유지 (혹은 False로 변경 고려)
    memo = models.CharField("메모", max_length=200, default="", blank=True) # 유지 여부 확인 필요
    
    is_active = models.BooleanField("계정 활성화 여부", default=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['phone', 'fullname', 'nickname']

    objects = UserManager()
    
    def __str__(self):
        return self.email

class Terms(models.Model):
    type = models.CharField("약관 종류", max_length=20, unique=True)
    title = models.CharField("제목", max_length=60)
    content = models.TextField("내용")

    def __str__(self):
        return self.title
