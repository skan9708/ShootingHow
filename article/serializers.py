import os
from django.contrib.auth import update_session_auth_hash

from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from article.models import (
    Notice, Instructor, InstructorComment,
    InstructorAttachment, Inquiry,
    InquiryAttachment, Faq,
)

def attachment_bulk_create(attachments, article, field, serializer_, delete_previous=False):
    if delete_previous:
        field.objects.filter(article_id=article.id).delete()
    attachments_bulk = [{"article": article.id, "attachment": x} for x in attachments]
    
    serializer = serializer_(data=attachments_bulk, many=True)    
    serializer.is_valid(raise_exception=True)
    serializer.save()


class InstructorAttachmentSerializer(serializers.ModelSerializer):
    filename = serializers.SerializerMethodField()
    filelink = serializers.SerializerMethodField()
    
    class Meta:
        model = InstructorAttachment
        fields = ['filename', 'attachment', 'article', 'filelink']
        extra_kwargs = {
            'article': {
                'write_only': True
            },
            'attachment': {
                'write_only': True
            },
        }
        
    def get_filename(self, obj):
        return os.path.basename(obj.attachment.name)
    
    def get_filelink(self, obj):
        return f'{os.path.dirname(obj.attachment.url)}/{obj.id}/'

class InstructorCommentSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()
    is_author = serializers.SerializerMethodField()
    is_admin = serializers.SerializerMethodField()
    is_comment_author = serializers.SerializerMethodField()
    
    class Meta:
        model = InstructorComment
        fields = ['id', 'author', 'content', 'created', 'is_admin', 'is_author', 'is_comment_author']

        extra_kwargs = {
            'content': {
                'error_messages': {
                    'required': '내용을 입력해주세요.',
                },
            },
        }
        
    def get_author(self, obj):
        return obj.author.fullname
    
    def get_is_admin(self, obj):
        return obj.author.is_superuser

    def get_is_author(self, obj):
        return obj.author == obj.article.author
    
    def get_is_comment_author(self, obj):
        return obj.author == self.context['request'].user
        
    def validate(self, attrs):
        article_id = self.context.get('article_id', '')
        
        if self.context['request'].method == 'POST':
            if not article_id:
                raise serializers.ValidationError({"error": "강사 게시글이 지정되지 않았습니다."})

            if not Instructor.objects.filter(id=article_id).exists():
                raise serializers.ValidationError({"error": "존재하지 않는 강사 게시글입니다."})
        
        return attrs
    
    def create(self, validated_data):
        validated_data['article_id'] = self.context.get('article_id')
        validated_data['author_id'] = self.context['request'].user.id

        return super().create(validated_data)
    
    
class InstructorListSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Instructor
        fields = [
            'id', 'title', 'created', 'view_count', 'author'
        ]
        
    def get_author(self, obj):
        return obj.author.fullname
        
class InstructorSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()
    is_author = serializers.SerializerMethodField()
    comments = InstructorCommentSerializer(source='instructorcomment_set', many=True, read_only=True)
    attachments = InstructorAttachmentSerializer(source='instructorattachment_set', many=True, required=False)
    side = serializers.SerializerMethodField()

    class Meta:
        model = Instructor
        read_only_fields = ['view_count']
        fields = [
            'id', 'author', 'is_author', 'title', 'content', 'created',
            'view_count', 'comments', 'attachments', 'side'
        ]
        
        extra_kwargs = {
            'title': {
                'error_messages': {
                    'required': '게시글 제목을 입력해주세요.',
                },
            },
            'content': {
                'error_messages': {
                    'required': '내용을 입력해주세요.',
                },
            },
        }
        
    def get_author(self, obj):
        return obj.author.fullname
    
    def get_is_author(self, obj):
        return obj.author == self.context['request'].user
    
    def validate(self, attrs):
        if len(self.context.get('attachments', [])) > 4:
            raise serializers.ValidationError({"error": "파일은 최대 4개까지 첨부 가능합니다."})
        
        return attrs
    
    def create(self, validated_data):
        validated_data['author_id'] = self.context['request'].user.id
        instance = super().create(validated_data)
        
        attachments = self.context.get('attachments', [])
        if attachments:
            attachment_bulk_create(attachments, instance,
                                   InstructorAttachment, InstructorAttachmentSerializer)
        
        return instance
    
    def update(self, instance, validated_data):
        attachments = self.context.get('attachments', [])
        
        if attachments:
            attachment_bulk_create(attachments, instance,
                                   InstructorAttachment, InstructorAttachmentSerializer,
                                   delete_previous=True)
            
        return super().update(instance, validated_data)
    
    def get_side(self, obj):
        #TODO 신고 된 article은 노출되지 않음
        object_ids = list(Instructor.objects.filter().values_list('id', flat=True))
        current_idx = object_ids.index(obj.id)
        
        next_id, previous_id = None, None
        
        if current_idx < len(object_ids) - 1:
            next_id = object_ids[current_idx + 1]
        if current_idx > 0:
            previous_id = object_ids[current_idx - 1]
            
        return {
            'next': next_id,
            'previous': previous_id,
        }
        

class InquiryAttachmentSerializer(serializers.ModelSerializer):
    filename = serializers.SerializerMethodField()
    filelink = serializers.SerializerMethodField()

    class Meta:
        model = InquiryAttachment
        fields = ['filename', 'attachment', 'article', 'filelink']
        extra_kwargs = {
            'article': {
                'write_only': True
            },
            'attachment': {
                'write_only': True
            },
        }
    
    def get_filename(self, obj):
        return os.path.basename(obj.attachment.name)
    
    def get_filelink(self, obj):
        return f'{os.path.dirname(obj.attachment.url)}/{obj.id}/'

    
# class InquiryCommentSerializer(serializers.ModelSerializer):
#     author = serializers.SerializerMethodField()
#     is_admin = serializers.SerializerMethodField()
#     is_author = serializers.SerializerMethodField()
#     is_comment_author = serializers.SerializerMethodField()
    
#     class Meta:
#         model = InquiryComment
#         fields = ['id', 'author', 'content', 'created', 'is_admin', 'is_author', 'is_comment_author']
        
#         extra_kwargs = {
#             'content': {
#                 'error_messages': {
#                     'required': '내용을 입력해주세요.',
#                 },
#             },
#         }
        
#     def get_author(self, obj):
#         return obj.author.fullname

#     def get_is_admin(self, obj):
#         return obj.author.is_superuser

#     def get_is_author(self, obj):
#         return obj.author == obj.article.author

#     def get_is_comment_author(self, obj):
#         return obj.author == self.context['request'].user
        
#     def validate(self, attrs):
#         article_id = self.context.get('article_id', '')
        
#         if self.context['request'].method == 'POST':
#             if not article_id:
#                 raise serializers.ValidationError({"error": "문의글이 지정되지 않았습니다."})
        
#             if not Inquiry.objects.filter(id=article_id).exists():
#                 raise serializers.ValidationError({"error": "존재하지 않는 문의글입니다."})
        
#         return attrs
    
#     def create(self, validated_data):
#         validated_data['article_id'] = self.context.get('article_id')
#         validated_data['author_id'] = self.context['request'].user.id

#         return super().create(validated_data)
    
    
class InquiryListSerializer(serializers.ModelSerializer):
    is_solved = serializers.SerializerMethodField()
    
    class Meta:
        model = Inquiry
        fields = [
            'id', 'title', 'created', 'view_count', 'is_solved',
        ]
        
    def get_is_solved(self, obj):
        return '답변완료' if obj.answer else '답변전'
        
        
class InquirySerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()
    # comments = InquiryCommentSerializer(source='inquirycomment_set', many=True, read_only=True)
    attachments = InquiryAttachmentSerializer(source='inquiryattachment_set', many=True, required=False)
    side = serializers.SerializerMethodField()
    class Meta:
        model = Inquiry
        read_only_fields = ['view_count']
        fields = [
            'id', 'author', 'title', 'content', 'created',
            'view_count', 'attachments', 'side', 'answer', 
        ]
        
        extra_kwargs = {
            'title': {
                'error_messages': {
                    'required': '게시글 제목을 입력해주세요.',
                },
            },
            'content': {
                'error_messages': {
                    'required': '내용을 입력해주세요.',
                },
            },
        }
        
    def get_author(self, obj):
        return obj.author.fullname
    
    def validate(self, attrs):
        if len(self.context.get('attachments', [])) > 3:
            raise serializers.ValidationError({"error": "파일은 최대 3개까지 첨부 가능합니다."})
        
        return attrs
    
    def create(self, validated_data):
        validated_data['author_id'] = self.context['request'].user.id
        instance = super().create(validated_data)
        
        attachments = self.context.get('attachments', [])
        if attachments:
            attachment_bulk_create(attachments, instance,
                                   InquiryAttachment, InquiryAttachmentSerializer)
        
        return instance
    
    def update(self, instance, validated_data):
        attachments = self.context.get('attachments', [])
        
        if attachments:
            attachment_bulk_create(attachments, instance,
                                   InquiryAttachment, InquiryAttachmentSerializer,
                                   delete_previous=True)
            
        return super().update(instance, validated_data)
    
    def get_side(self, obj):
        #TODO 신고 된 article은 노출되지 않음
        object_ids = list(Inquiry.objects.filter().values_list('id', flat=True))
        current_idx = object_ids.index(obj.id)
        
        next_id, previous_id = None, None
        
        if current_idx < len(object_ids) - 1:
            next_id = object_ids[current_idx + 1]
        if current_idx > 0:
            previous_id = object_ids[current_idx - 1]
            
        return {
            "next": next_id,
            "previous": previous_id,
        }

class NoticeListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notice
        fields = [
            'id', 'title', 'created', 'view_count'
        ]
        
        
class NoticeSerializer(serializers.ModelSerializer):
    side = serializers.SerializerMethodField()
    
    class Meta:
        model = Notice
        fields = ['id', 'title', 'content', 'created', 'view_count', 'side']
        read_only_fields = ['title', 'content', 'created', 'view_count']
        
    def get_side(self, obj):
        object_ids = list(Notice.objects.filter().values_list('id', flat=True))
        current_idx = object_ids.index(obj.id)
        
        next_id, previous_id = None, None
        
        if current_idx < len(object_ids) - 1:
            next_id = object_ids[current_idx + 1]
        if current_idx > 0:
            previous_id = object_ids[current_idx - 1]
            
        return {
            'next': next_id,
            'previous': previous_id,
        }

class NoticeAttachmentSerializer(serializers.ModelSerializer):
    filename = serializers.SerializerMethodField()
    filelink = serializers.SerializerMethodField()
    
    class Meta:
        model = Notice
        fields = ['filename', 'attachment', 'filelink']
        extra_kwargs = {
            'attachment': {
                'write_only': True
            },
        }
        
    def get_filename(self, obj):
        return os.path.basename(obj.attachment.name)
    
    def get_filelink(self, obj):
        return f'{os.path.dirname(obj.attachment.url)}/{obj.id}/'

class FaqSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Faq
        fields = ['id', 'title', 'content', ]
        read_only_fields = ['title', 'content', ]


# class InquiryCommentSimpleSerializer(serializers.ModelSerializer):

#     class Meta:
#         model = InquiryComment
#         fields = ['content', 'created', ]


class InstructorCommentSimpleSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = InstructorComment
        fields = ['content', 'created', ]
        