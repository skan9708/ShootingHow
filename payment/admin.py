from django.contrib import admin
from payment.models import PaymentHistory, OrderID

# Register your models here.
class PaymentHistoryAdmin(admin.ModelAdmin):
    def get_readonly_fields(self, request, obj=None):
        # make readonly all fields
        return [f.name for f in self.model._meta.fields]

admin.site.register(PaymentHistory, PaymentHistoryAdmin)
admin.site.register(OrderID)