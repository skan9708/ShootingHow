from django.contrib import admin
# from django.conf import settings
# from django.db import models
# from django_mptt_admin.admin import DjangoMpttAdmin, FilterableDjangoMpttAdmin
# from mptt.admin import DraggableMPTTAdmin, MPTTModelAdmin, TreeRelatedFieldListFilter

from staticlist.models import Static, StaticItem, StaticItemLink

class StaticItemLinkInline(admin.StackedInline):
    model = StaticItemLink
    extra = 0
    
    
class StaticItemAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'static',
        'author',
    )
    list_filter = ('static__code', )
    list_display_links = ('title', )
    
    inlines = [StaticItemLinkInline, ]
    
    # fieldsets = ('가격 수정', {
    #                 'fields': ('value', ),
    #                 'description': f"""<div class="help" style="font-size: 14px">
    #                             하단에서 가격 혹은 상품 정보를 수정 할 수 있습니다.<br>
    #                             </div>"""
    #             })

    
admin.site.register(Static)
admin.site.register(StaticItem, StaticItemAdmin)

