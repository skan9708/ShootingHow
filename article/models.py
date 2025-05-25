from django.db import models
from ckeditor.fields import RichTextField
from django.conf import settings
from django.core.validators import FileExtensionValidator

ATTACHMENT_ALLOW_EXTENTIONS = ["pdf", "png", "jpg", "jpeg"]

class Notice(models.Model):
    title = models.CharField("제목", max_length=60)
    content = RichTextField("게시글 본문")
    created = models.DateTimeField("작성일", auto_now_add=True)
    view_count = models.IntegerField("조회수", default=0)
    top_fixed = models.BooleanField("상단 고정 여부", default=False)
    attachment = models.FileField("첨부파일", upload_to="article/notice", null=True, blank=True)

    def __str__(self):
        return self.title
    
    
class Instructor(models.Model):
    author = models.ForeignKey("account.User", verbose_name="작성자", on_delete=models.SET_NULL, null=True)
    title = models.CharField("제목", max_length=60)
    content = models.TextField("게시글 본문")
    created = models.DateTimeField("작성일", auto_now_add=True)
    view_count = models.IntegerField("조회수", default=0)
    is_visible = models.BooleanField("공개 여부", default=True)
    
    def __str__(self):
        try:
            return f"{self.author.fullname} / {self.title}"
        except:
            return f"- / {self.title}"
    
    
class InstructorComment(models.Model):
    author = models.ForeignKey("account.User", verbose_name="작성자", on_delete=models.SET_NULL, null=True)
    article = models.ForeignKey(Instructor, verbose_name="게시글", on_delete=models.CASCADE)
    content = models.CharField("댓글 내용", max_length=200)
    created = models.DateTimeField("작성일", auto_now_add=True)
    
    def __str__(self):
        try:
            return f"{self.author.fullname} / {self.content}"
        except:
            return f"- / {self.content}"
    
    
class InstructorAttachment(models.Model):
    article = models.ForeignKey(Instructor, verbose_name="게시글", on_delete=models.CASCADE)
    attachment = models.FileField("첨부파일", upload_to="article/instructor", validators=[FileExtensionValidator(allowed_extensions=ATTACHMENT_ALLOW_EXTENTIONS)])
    
    def __str__(self):
        return f"{self.article.title} / {self.attachment}"
    
class Inquiry(models.Model):
    author = models.ForeignKey("account.User", verbose_name="작성자", on_delete=models.SET_NULL, null=True)
    title = models.CharField("제목", max_length=60)
    content = models.TextField("게시글 본문")
    created = models.DateTimeField("작성일", auto_now_add=True)
    answer = models.TextField("답변", default='')
    view_count = models.IntegerField("조회수", default=0)
    # is_solved = models.BooleanField("해결여부", default=False)
    is_visible = models.BooleanField("공개 여부", default=True)
    
    def __str__(self):
        try:
            return f"{self.author.fullname} / {self.title}"
        except:
            return f"- / {self.title}"
    
    
# class InquiryComment(models.Model):
#     author = models.ForeignKey("account.User", verbose_name="작성자", on_delete=models.SET_NULL, null=True)
#     article = models.ForeignKey(Inquiry, verbose_name="게시글", on_delete=models.CASCADE)
#     content = models.CharField("댓글 내용", max_length=200)
#     created = models.DateTimeField("작성일", auto_now_add=True)
    
#     def __str__(self):
#         try:
#             return f"{self.author.fullname} / {self.content}"
#         except:
#             return f"- / {self.content}"
    
class InquiryAttachment(models.Model):
    article = models.ForeignKey(Inquiry, verbose_name="게시글", on_delete=models.CASCADE)
    attachment = models.FileField("첨부파일", upload_to="article/inquiry", validators=[FileExtensionValidator(allowed_extensions=ATTACHMENT_ALLOW_EXTENTIONS)])
    
    def __str__(self):
        return f"{self.article.title} / {self.attachment}"


class Faq(models.Model):
    question = models.CharField("질문", max_length=60)
    answer = models.TextField("답변")
    created = models.DateTimeField("작성일", auto_now_add=True)
    order = models.IntegerField("순서", default=0)
    
    def __str__(self):
        return self.title


class InstructorReport(models.Model):
    user = models.ForeignKey("account.User", verbose_name="신고자", on_delete=models.CASCADE)
    target = models.ForeignKey(Instructor, verbose_name="게시글", on_delete=models.CASCADE)
    datetime = models.DateTimeField("신고 시간", auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.fullname} / {self.target.title} / {self.datetime}"

class InquiryReport(models.Model):
    user = models.ForeignKey("account.User", verbose_name="신고자", on_delete=models.CASCADE)
    target = models.ForeignKey(Inquiry, verbose_name="게시글", on_delete=models.CASCADE)
    datetime = models.DateTimeField("신고 시간", auto_now_add=True)

    def __str__(self):
        return f"{self.user.fullname} / {self.target.title} / {self.datetime}"
    
class InstructorCommentReport(models.Model):
    user = models.ForeignKey("account.User", verbose_name="신고자", on_delete=models.CASCADE)
    target = models.ForeignKey(InstructorComment, verbose_name="게시글", on_delete=models.CASCADE)
    datetime = models.DateTimeField("신고 시간", auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.fullname} / {self.datetime}"

# class InquiryCommentReport(models.Model):
#     user = models.ForeignKey("account.User", verbose_name="신고자", on_delete=models.CASCADE)
#     target = models.ForeignKey(InquiryComment, verbose_name="게시글", on_delete=models.CASCADE)
#     datetime = models.DateTimeField("신고 시간", auto_now_add=True)

#     def __str__(self):
#         return f"{self.user.fullname} / {self.datetime}"
