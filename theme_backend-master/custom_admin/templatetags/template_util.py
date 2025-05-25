from datetime import datetime

from django import template
from custom_admin.views import admin_page

register = template.Library()

CATEGORY_INFO_LIST = {
    'home': {
        'verbose_name': '홈',
        'icon': 'mdi mdi-home-minus',
    },
    'account': {
        'verbose_name': '회원관리',
        'icon': 'bx bxs-user',
    },
    'product': {
        'verbose_name': '상품 관리',
        'icon': 'mdi mdi-shopping-outline',
    },
    'reservation': {
        'verbose_name': '예약 및 결제 관리',
        'icon': 'mdi mdi-credit-card-outline',
    },
    'article': {
        'verbose_name': '게시판 관리',
        'icon': 'mdi mdi-clipboard-edit-outline',
    },
    'etc': {
        'verbose_name': '기타 관리',
        'icon': 'mdi mdi-comment-text',
    },
    # 'instructor': [],
    # 'instructor_manage': [],
    # 'service': [],
    # 'etc': [],
}

@register.filter
def test(value):
    # {{ "asdf"|test }}
    print(value)
    return "test"

@register.filter
def cut(value, arg):
    # {{ "23521#fw9090"|cut:"0" }}
    return value.replace(arg, '')

@register.simple_tag
def get_head_title():
    return '테마스쿠버 관리자'

@register.simple_tag
def get_page_list(user):
    page_list = {}
    if user.is_superuser:
        page_list = admin_page.page_list
    
    elif user.is_staff:
        for category, pages in admin_page.page_list.items():
            for page in pages:
                if page.admin_permission == 'staff':
                    if page_list.get(category):
                        page_list[category].append(page)
                    else:
                        page_list[category] = [page]
    
    return page_list

@register.filter
def get_category_verbose_name(category):
    return CATEGORY_INFO_LIST.get(category, {}).get('verbose_name', category)

@register.filter
def get_category_icon(category):
    return CATEGORY_INFO_LIST.get(category, {}).get('icon', 'mdi mdi-credit-card')

@register.filter
def get_key_from_value(dict_, key):
    return [k for k, v in dict_.items() if v == key][0]

@register.filter
def get_value_from_key(dict_, key):
    return dict_[key]
    # return [k for k, v in dict_.items() if v == key][0]

# @register.filter
# def set_format(value, format_):
#     if not format_:
#         return value
    
#     type_, form = format_.split('|')
    
#     if type_ == 'date':
#         return value.strftime(form)
    
#     if type_ == 'display':
#         return 
    
#     return value

# @register.filter
# def split_row_data(row):
#     return row[:-1], [-1]