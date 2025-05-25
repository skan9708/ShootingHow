from django.db.models import Count

from rest_framework import status, viewsets, mixins
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response

from theme.permissions import IsAuthenticatedAndIsInstructor, IsAuthenticated

from article.serializers import (
    InstructorListSerializer, InstructorSerializer,
    InstructorCommentSerializer, NoticeSerializer,
    NoticeListSerializer,
    InquiryListSerializer, InquirySerializer,
    FaqSerializer
)

from article.models import (
    Notice, Instructor, InstructorComment,
    InstructorAttachment, Inquiry,
    InquiryAttachment, Faq, InstructorReport, InquiryReport,
    InstructorCommentReport
)


class InstructorViewSet(viewsets.ModelViewSet):
    serializer_class = InstructorSerializer
    # 신고 건수가 10회 미만인 게시글만 노출
    # queryset = Instructor.objects.annotate(report_count=Count('instructorreport')) \
    #                              .filter(report_count__lte=10).order_by('-id')
    permission_classes = [IsAuthenticatedAndIsInstructor]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return InstructorListSerializer
        
        return self.serializer_class
    
    def get_queryset(self):
        if self.action in ['update', 'destroy']:
            return Instructor.objects.filter(author=self.request.user).order_by('-id')
        

        return Instructor.objects.annotate(report_count=Count('instructorreport')) \
                            .filter(report_count__lte=10).order_by('-id')
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.view_count += 1
        instance.save()
        
        serializer = self.get_serializer(instance)
        
        return Response(serializer.data)
    
    def create(self, request, *args, **kwargs):
        context = {
            'request': request,
        }
        
        if request.data.get('attachments', []):
            context['attachments'] = [x for x in request.data.getlist('attachments') if not isinstance(x, str)]

        serializer = self.get_serializer(data=request.data, context=context)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        headers = self.get_success_headers(serializer.data)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def update(self, request, *args, **kwargs):
        context = {
            'request': request,
        }
        
        if request.data.get('attachments', []):
            context['attachments'] = [x for x in request.data.getlist('attachments') if not isinstance(x, str)]
            
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True, context=context)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def report(self, request, pk):
        """신고하기"""

        instructor_report, created = InstructorReport.objects.get_or_create(
            user_id=request.user.id,
            target_id=pk
        )
        if created:
            return Response({"message": f"{instructor_report.target.title} 게시글을 신고했습니다."})
        
        return Response({"message": f"이미 신고한 게시글입니다."})
        
        

class InstructorCommentViewSet(mixins.CreateModelMixin,
                               mixins.UpdateModelMixin,
                               mixins.DestroyModelMixin,
                               viewsets.GenericViewSet):
    serializer_class = InstructorCommentSerializer
    permission_classes = [IsAuthenticatedAndIsInstructor]
    
    def get_queryset(self):
        return InstructorComment.objects.filter(author=self.request.user)
    
    def create(self, request, *args, **kwargs):
        context = {
            'request': request,
            'article_id': request.data.get('article_id')
        }
        serializer = self.get_serializer(data=request.data, context=context)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        headers = self.get_success_headers(serializer.data)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    @action(detail=True, methods=["post"])
    def report(self, request, pk):
        """신고하기"""

        instructor_comment_report, created = InstructorCommentReport.objects.get_or_create(
            user_id=request.user.id,
            target_id=pk
        )
        if created:
            return Response({"message": f"{instructor_comment_report.target.content} 댓글을 신고했습니다."})
        
        return Response({"message": f"이미 신고한 게시글입니다."})

        
class InquiryViewSet(viewsets.ModelViewSet):
    serializer_class = InquirySerializer
    # queryset = Inquiry.objects.annotate(report_count=Count('inquiryreport')) \
                            #   .filter(report_count__lte=10).order_by('-id')
    # permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.action == 'retrieve' and self.request.user.is_superuser:
            return Inquiry.objects.all().order_by('-id')
        
        if self.action in ['retrieve', 'update', 'destroy']:
            return Inquiry.objects.filter(author=self.request.user).order_by('-id')
        

        return Inquiry.objects.annotate(report_count=Count('inquiryreport')) \
                            .filter(report_count__lte=10).order_by('-id')
        
    def get_serializer_class(self):
        if self.action == 'list':
            return InquiryListSerializer
        
        return self.serializer_class
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.view_count += 1
        instance.save()
        
        serializer = self.get_serializer(instance)
        
        return Response(serializer.data)
    
    def create(self, request, *args, **kwargs):
        context = {
            'request': request,
        }
        
        if request.data.get('attachments', []):
            context['attachments'] = [x for x in request.data.getlist('attachments') if not isinstance(x, str)]

        serializer = self.get_serializer(data=request.data, context=context)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        headers = self.get_success_headers(serializer.data)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def update(self, request, *args, **kwargs):
        context = {
            'request': request,
        }
        
        if request.data.get('attachments', []):
            context['attachments'] = [x for x in request.data.getlist('attachments') if not isinstance(x, str)]

        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True, context=context)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)
    
    @action(detail=True, methods=["post"])
    def report(self, request, pk):
        """신고하기"""

        inquiry_report, created = InquiryReport.objects.get_or_create(
            user_id=request.user.id,
            target_id=pk
        )
        if created:
            return Response({"message": f"{inquiry_report.target.title} 게시글을 신고했습니다."})
        
        return Response({"message": f"이미 신고한 게시글입니다."})
        

# class InquiryCommentViewSet(mixins.CreateModelMixin,
#                             mixins.UpdateModelMixin,
#                             mixins.DestroyModelMixin,
#                             viewsets.GenericViewSet):
#     serializer_class = InquiryCommentSerializer
#     permission_classes = [IsAuthenticated]
    
#     def get_queryset(self):
#         return InquiryComment.objects.filter(author=self.request.user)
    
#     def create(self, request, *args, **kwargs):
#         context = {
#             'request': request,
#             'article_id': request.data.get('article_id')
#         }
#         serializer = self.get_serializer(data=request.data, context=context)
#         serializer.is_valid(raise_exception=True)
#         self.perform_create(serializer)
        
#         headers = self.get_success_headers(serializer.data)
        
#         return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
#     @action(detail=True, methods=["post"])
#     def report(self, request, pk):
#         """신고하기"""

#         inquiry_comment_report, created = InquiryCommentReport.objects.get_or_create(
#             user_id=request.user.id,
#             target_id=pk
#         )
#         if created:
#             return Response({"message": f"{inquiry_comment_report.target.content} 댓글을 신고했습니다."})
        
#         return Response({"message": f"이미 신고한 게시글입니다."})
        
class FaqViewSet(mixins.ListModelMixin,
                 viewsets.GenericViewSet):
    serializer_class = FaqSerializer
    queryset = Faq.objects.all().order_by('-id')
    permission_classes = [AllowAny]
            
    
class NoticeViewSet(mixins.RetrieveModelMixin,
                    mixins.ListModelMixin,
                    viewsets.GenericViewSet):
    serializer_class = NoticeSerializer
    queryset = Notice.objects.all().order_by('-id')
    permission_classes = [IsAuthenticatedAndIsInstructor]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return NoticeListSerializer
        
        return self.serializer_class
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.view_count += 1
        instance.save()
        
        serializer = self.get_serializer(instance)
        
        return Response(serializer.data)