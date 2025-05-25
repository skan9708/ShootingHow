from django.db import models

# Create your models here.
class Static(models.Model):
    code = models.CharField("코드", max_length=50, unique=True)
    name = models.CharField("이름", max_length=100)
    
    def __str__(self):
        return f"{self.code} / {self.name}"


class StaticItem(models.Model):
    static = models.ForeignKey(Static, verbose_name="스태틱", on_delete=models.CASCADE)
    title = models.CharField("타이틀", max_length=50, null=True, blank=True)
    description = models.TextField("설명", null=True, blank=True)
    author = models.CharField("작성자", max_length=30, null=True, blank=True)
    image = models.FileField("이미지", upload_to="static/image", null=True, blank=True)
    
    def __str__(self):
        return f"{self.static.code} / {self.static.name} | {self.title}"
    
    
class StaticItemLink(models.Model):
    static_item = models.ForeignKey(StaticItem, verbose_name="스태틱 아이템", on_delete=models.CASCADE, related_name='links')
    link = models.CharField("링크", max_length=200)
    link_name = models.CharField("링크 이름", max_length=30)
    
    def __str__(self):
        return f"{self.static_item.title} / {self.link_name}"
    