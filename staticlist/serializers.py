import datetime

from collections import OrderedDict

from django.conf import settings
from rest_framework import serializers

from staticlist.models import StaticItem, StaticItemLink

class StaticItemLinkSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = StaticItemLink
        fields = ['link', 'link_name', ]


class StaticItemSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField(read_only=True)
    links = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = StaticItem
        fields = ['static', 'title', 'description', 'image', 'author', 'links', ]
        
    def get_links(self, obj):
        item_links = obj.links.all().order_by('-id')
        data = {}
        
        for i, item_link in enumerate(item_links):
            data.update({
                f"link{i}": item_link.link,
                f"link_name{i}": item_link.link_name,
            })
            
        return data
    
    def get_image(self, obj):
        if obj.image:
            return obj.image.url
        else:
            return ""
    