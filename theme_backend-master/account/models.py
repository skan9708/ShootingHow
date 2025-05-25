from django.db import models
from django.core.validators import RegexValidator, FileExtensionValidator
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin

ATTACHMENT_ALLOW_EXTENTIONS = ["pdf", "png", "jpg", "jpeg"]

class UserManager(BaseUserManager):
    def create_user(self, phone, email, password=None):
        if not phone:
            raise ValueError('Users must have an phone')
        user = self.model(
            phone=phone,
            email=email,
            birthday="2000-02-02"
        )
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, phone, email, password=None):
        user = self.create_user(
            phone=phone,
            email=email,
            password=password
        )
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user

class User(AbstractBaseUser, PermissionsMixin):
    ROLES = (
        ('normal', '일반회원'),
        ('waiting_instructor_request', '일반회원(강사회원 승인대기)'),
        ('instructor', '강사회원'),
        ('registered_instructor', '등록강사'),
        ('responsible_instructor', '책임강사'),
    )
    JOIN_TYPES = (
        ('normal', '일반'),
        ('kakao', '카카오'),
        ('by_admin', '관리자 생성'),
    )
    phone_validator = RegexValidator(regex=r'01[0|1|6|7|8|9]\d{3,4}\d{4}$',
                                     message='올바른 핸드폰 번호를 입력해주세요.',
                                     code='invalid')
    
    email = models.EmailField("이메일", unique=True, error_messages={'unique': "이미 존재하는 이메일 주소입니다."}, null=True, blank=True)
    password = models.CharField("비밀번호", max_length=150)
    fullname = models.CharField("이름", max_length=30)
    phone = models.CharField("핸드폰번호", validators=[phone_validator],
                             unique=True, max_length=20,
                             error_messages={'unique': "이미 존재하는 핸드폰 번호입니다."})
    birthday = models.DateField("생년월일", blank=True, null=True)
    join_date = models.DateTimeField("가입일", auto_now_add=True)
    member_num = models.CharField("회원번호", max_length=30, default="", blank=True)
    join_type = models.CharField("가입 유형", choices=JOIN_TYPES, max_length=30, default="일반", blank=True)
    memo = models.CharField("메모", max_length=200, default="", blank=True)
    
    role = models.CharField("회원종류", choices=ROLES, max_length=30, default='normal')
    # license = models.FileField("라이센스", upload_to='user/license', null=True, blank=True, validators=[FileExtensionValidator(allowed_extensions=ATTACHMENT_ALLOW_EXTENTIONS)])
    
    kakao = models.CharField("카카오", max_length=30, default=None, null=True, blank=True)
    pass_unique_id = models.CharField("pass 고유 키", max_length=50, default=None, null=True, blank=True)

    is_active = models.BooleanField("계정 활성화 여부", default=True)
    is_staff = models.BooleanField("staff 권한", default=False)
    is_superuser = models.BooleanField("superuser 권한", default=False)
    
    instructor_register_date = models.DateField("강사 등록일자", default=None, null=True, blank=True)
    instructor_expired_date = models.DateField("강사 만료일자", default=None, null=True, blank=True)

    USERNAME_FIELD = 'phone'
    REQUIRED_FIELDS = ['email']

    objects = UserManager()
    
    def __str__(self):
        return self.phone

    def create_member_num(slef):
        """
        TODO
        회원 번호 생성
        TM(테마)+221231(가입날짜)+0001(당일가입순서)
        ex) TM2212310001
        """
        
    # def ger_role_display_value(self):
    #     return ROLES
    
    # @property
    # def join_type(self):
    #     if self.kakao:
    #         return "카카오톡"
    #     else:
    #         return "일반"
    # join_type_verbose = "가입유형"

    # def has_perm(self, perm, obj=None):
    #     return True

    # def has_module_perms(self, perm, obj=None):
    #     return True
    
    # @property
    # def is_staff(self):
    #     return self.is_admin
    
class UserLicense(models.Model):
    user = models.ForeignKey(User, verbose_name="라이센스", on_delete=models.CASCADE, related_name='licenses')
    image = models.FileField("라이센스 이미지", upload_to='user/license', null=True, blank=True, validators=[FileExtensionValidator(allowed_extensions=ATTACHMENT_ALLOW_EXTENTIONS)])


class Terms(models.Model):
    type = models.CharField("약관 종류", max_length=20, unique=True)
    title = models.CharField("제목", max_length=60)
    content = models.TextField("내용")

    def __str__(self):
        return self.title
