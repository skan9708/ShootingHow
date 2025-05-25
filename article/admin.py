from django.contrib import admin

from article.models import (
    Notice, Instructor, InstructorComment, InstructorAttachment,
    Inquiry, InquiryAttachment, Faq, InquiryReport, InstructorReport
)

class InstructorCommentInline(admin.StackedInline):
    model = InstructorComment
    extra = 0
    
    
class InstructorAttachmentInline(admin.StackedInline):
    model = InstructorAttachment
    extra = 0


class InstructorAdmin(admin.ModelAdmin):
    list_display = ('id', 'author', 'title')
    list_display_links = ('title',)
    list_filter = ('author', )
    
    inlines = [
        InstructorCommentInline,
        InstructorAttachmentInline
    ]


# class InquiryCommentInline(admin.StackedInline):
#     model = InquiryComment
#     extra = 0
    
    
class InquiryAttachmentInline(admin.StackedInline):
    model = InquiryAttachment
    extra = 0


class InquiryAdmin(admin.ModelAdmin):
    list_display = ('id', 'author', 'title')
    list_display_links = ('title',)
    list_filter = ('author', )
    
    inlines = [
        # InquiryCommentInline,
        InquiryAttachmentInline
    ]


admin.site.register(Instructor, InstructorAdmin)
admin.site.register(Inquiry, InquiryAdmin)
admin.site.register(Notice)
admin.site.register(Faq)
admin.site.register(InquiryReport)
admin.site.register(InstructorReport)
