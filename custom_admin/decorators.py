
from django.contrib.auth import REDIRECT_FIELD_NAME
from django.contrib.auth.decorators import user_passes_test
from django.utils.decorators import method_decorator

def admin_required(function=None, redirect_field_name=REDIRECT_FIELD_NAME, login_url='admin-login'):
    ret = user_passes_test(
        lambda u : u.is_authenticated and u.is_superuser,
        login_url=login_url,
        redirect_field_name=redirect_field_name
    )
    if function:
        return ret(function)
    return ret

def staff_required(function=None, redirect_field_name=REDIRECT_FIELD_NAME, login_url='admin-login'):
    ret = user_passes_test(
        lambda u : u.is_authenticated and u.is_staff,
        login_url=login_url,
        redirect_field_name=redirect_field_name
    )
    if function:
        return ret(function)
    return ret
