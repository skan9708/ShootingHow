from django.contrib import admin
from django.conf import settings
from django.db import models
from django_mptt_admin.admin import DjangoMpttAdmin, FilterableDjangoMpttAdmin
from mptt.admin import DraggableMPTTAdmin, MPTTModelAdmin, TreeRelatedFieldListFilter

from product.models import (
    ProductInfo, ReservationCalendar, 
    ReservationSchedule, Reservation,
    ProductIntroduce, SwimReservationManagement,
)

from django.forms import TextInput, Textarea

class ProductIntroduceInline(admin.StackedInline):
    model = ProductIntroduce
    extra = 0
    
    
class ProductInfoAdmin(DjangoMpttAdmin):
    list_display = (
        'id',
        'type',
        'name',
        'parent',
    )
    list_filter = ('type', )
    list_display_links = ('name', )
    
    formfield_overrides = {
        models.TextField: {'widget': Textarea(attrs={'rows':20, 'cols':70})},
    }
    
    def get_inlines(self, request, obj):
        if obj and obj.level == 2:
            return [ProductIntroduceInline]
        else: 
            return []
    
    
    def get_fieldsets(self, request, obj=None):
        if obj and obj.level == 3:
            return (
                (None, {
                    'fields': ('parent', 'name', )}
                ),
                ('가격 수정', {
                    'fields': ('value', ),
                    'description': f"""<div class="help" style="font-size: 14px">
                                하단에서 가격 혹은 상품 정보를 수정 할 수 있습니다.<br>
                                </div>"""
                })
            )
            
        if obj and obj.level == 1:
            return (
                (None, {
                    'fields': ('name', )}
                ),
                ('인원 제한 수정', {
                    'fields': ('num_of_man_limit', 'num_of_woman_limit'),
                    'description': f"""<div class="help" style="font-size: 14px">
                                하단에서 인원 제한을 설정 할 수 있습니다.<br>
                                남/녀 통합 인원으로 진행할 경우 여성 인원 제한을 0으로 설정하면 됩니다.<br>
                                </div>"""
                })
            )
         
        return (
                (None, {
                    'fields': ('parent', 'name', )}
                ),
            )
        
    
    if not settings.DEBUG:
        def is_drag_and_drop_enabled(self):
            return False
        
        # def has_add_permission(self, request, obj=None):
        #     return False

        # def has_delete_permission(self, request, obj=None):
        #     return False

        # def has_change_permission(self, request, obj=None):
        #     return True
        
        readonly_fields = ('parent', 'name', )
    
    def changelist_view(self, request, extra_context=None):
        extra_context = {
            # 'title': '가격표를 수정 할 수 있는 페이지입니다. add 버튼은 사용 할 수 없습니다.',
            # 'tree_auto_open': True,
        }
        return super().changelist_view(request, extra_context=extra_context)

    
admin.site.register(ProductInfo, ProductInfoAdmin)
admin.site.register(ReservationCalendar)
admin.site.register(ReservationSchedule)
admin.site.register(Reservation)
admin.site.register(SwimReservationManagement)
