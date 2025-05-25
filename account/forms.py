from django import forms
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.contrib.auth.models import Permission as Permission
from django.utils.translation import gettext_lazy as _

from .models import User, UserManager


class UserCreationForm(forms.ModelForm):
    # 사용자 생성 폼
    phone = forms.CharField(
        label=_('핸드폰번호'),
        widget=forms.TextInput(
            attrs={
                'class': 'form-control',
                'placeholder': _('핸드폰번호'),
                'required': 'True',
            }
        )
    )
    # email = forms.EmailField(
    #     label=_('Email'),
    #     required=True,
    #     widget=forms.EmailInput(
    #         attrs={
    #             'class': 'form-control',
    #             'placeholder': _('Email address'),
    #             'required': 'True',
    #         }
    #     )
    # )
    password1 = forms.CharField(
        label=_('Password'),
        widget=forms.PasswordInput(
            attrs={
                'class': 'form-control',
                'placeholder': _('Password'),
                'required': 'True',
            }
        )
    )
    password2 = forms.CharField(
        label=_('Password confirmation'),
        widget=forms.PasswordInput(
            attrs={
                'class': 'form-control',
                'placeholder': _('Password confirmation'),
                'required': 'True',
            }
        )
    )

    class Meta:
        model = User
        fields = ('phone', )

    def clean_password2(self):
        # 두 비밀번호 입력 일치 확인
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords don't match")
        return password2

    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super(UserCreationForm, self).save(commit=False)
        user.phone = self.cleaned_data['phone']
        user.birthday = '2000-02-02'
        user.email = f'{user.phone}@admin.com'
        user.set_password(self.cleaned_data["password1"])
        
        if user.is_staff:
            default_staff_permissions = [
                    #TODO 수정예정
                    'view_user',
                    'change_user',
                ]
            
            permissions = Permission.objects.filter(codename__in=default_staff_permissions).values_list('id', flat=True)
            user.save()
            user.user_permissions.add(*list(permissions))
            user.save()
                
        if commit:
            user.save()
            
        return user


class UserChangeForm(forms.ModelForm):
    # 비밀번호 변경 폼
    password = ReadOnlyPasswordHashField(
        label=_('Password'),
        help_text=("Raw passwords are not stored, so there is no way to see \
                    this user's password, but you can change the password \
                    using <a href=\"../password/\">this form</a>.")
                )

    class Meta:
        model = User
        fields = ('phone', 'password', 'is_active', 'is_superuser')

    def clean_password(self):
        # Regardless of what the user provides, return the initial value.
        # This is done here, rather than on the field, because the
        # field does not have access to the initial value
        return self.initial["password"]