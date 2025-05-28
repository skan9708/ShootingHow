from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import Group

from .forms import UserCreationForm, UserChangeForm
from .models import User, Terms
from django.utils.translation import gettext_lazy as _


# class UserLicenseInline(admin.StackedInline):
#     model = UserLicense
#     extra = 0

class UserAdmin(BaseUserAdmin):
    # The forms to add and change user instances
    form = UserChangeForm
    add_form = UserCreationForm

    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ('id', 'phone', 'is_active', 'is_staff', 'is_superuser')
    list_display_links = ('phone',)
    list_filter = ('is_superuser', 'is_staff', 'role')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('phone', 'fullname', 'join_date', 'role')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'user_permissions')}),
    )
    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('phone', 'password1', 'password2', 'is_staff', )}
         ),
    )
    search_fields = ('phone', )
    ordering = ('-id',)
    
    filter_horizontal = ['user_permissions', ]
    
    # inlines = [
    #     UserLicenseInline
    # ]
    
    def get_readonly_fields(self, request, obj=None):
        if obj:
            return ('email', 'join_date', )
        else:
            return ('join_date', )


# Now register the new UserAdmin...
# admin.site.register(User)
admin.site.register(User, UserAdmin)
admin.site.register(Terms)

# Unregister the original Group admin.
admin.site.unregister(Group)
