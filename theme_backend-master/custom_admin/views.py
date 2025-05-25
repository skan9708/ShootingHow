import json

from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.urls import reverse
from django.urls.exceptions import NoReverseMatch
from django.db import transaction

from rest_framework import generics, status, viewsets
from rest_framework.renderers import TemplateHTMLRenderer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAdminUser

from account.models import User, Terms

from article.models import (
    Notice, Instructor, InstructorComment, Faq, 
    InstructorAttachment, Inquiry,
    InquiryAttachment, InstructorReport, InquiryReport,
    InstructorCommentReport, 
)

from product.models import (
    ProductInfo, ProductIntroduce, ReservationCalendar,
    ReservationSchedule, Reservation, SwimReservationManagement,
)

from product.serializers import (ProductInfoSerializer)

from custom_admin.serializers import (
    UserAdminSerializer, UserListAdminSerializer, 
    ProductInfoAdminSerializer, UserDetailAdminSerializer,
    ReservationListAdminSerializer, ReservationDetailAdminSerializer,
    InquiryListAdminSerializer, InquiryDetailAdminSerializer,
    InstructorListAdminSerializer,
    InstructorCommentAdminSerializer, InstructorDetailAdminSerializer,
    CommentSerializer, ReportSerializer, StaffAdminSerializer,
    StaffDetailAdminSerializer, StaffListAdminSerializer,
    FaqDetailAdminSerializer, FaqListAdminSerializer,
    FaqAdminSerializer, NoticeListAdminSerializer, 
    NoticeDetailAdminSerializer, NoticeAdminSerializer,
    TermsListAdminSerializer
)

# class AdminPage:
#     def __init__(self, url_path, view, url_name, verbose_name=None):
#         self.url_path = url_path
#         self.view = view
#         self.url_name = url_name
#         self.verbose_name = verbose_name

class admin_page:
    page_list = {}
    
    @classmethod
    def register(cls, view, admin_permission='superuser'):
        view.admin_permission = admin_permission
        cls.page_list.setdefault(view.category, []).append(view)
    # def __iter__(self):
    #     for element in self.page_list:
    #         yield element
    
def get_page_setting(category, app_name, action):
    if action == 'list':
        sub_url = ''
        
    elif action == 'detail':
        sub_url = '/<int:pk>'
        
    elif action == 'create':
        sub_url = '/create'
    
    url_path = f'{app_name}{sub_url}'
    url_name = f'admin-{category}-{app_name}-{action}'
    template = f'page/{category}/{app_name}/{app_name}-{action}.html'
    
    context = {
        'category': category,
        'js': f'page/{category}/{app_name}/{app_name}.js.html',

        'create_url': f'admin-{category}-{app_name}-create',
        'detail_url': f'admin-{category}-{app_name}-detail',
        'list_url': f'admin-{category}-{app_name}-list',
    }
    
    return url_path, url_name, template, context
    
class AdminLoginView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        user = request.user
        if user.is_anonymous or not user.is_staff:
            return render(request, 'page/login.html')
        
        return redirect('admin')
        
    def post(self, request):
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        user = authenticate(username=username, password=password)
        
        if user:       
            login(request, user)
            data={}
            data['success_message'] ='로그인 성공'
            return Response(data)
        
        data={}
        data['error_message'] ='로그인 정보가 일치하지 않습니다.'
        return Response(data)

class AdminLogoutView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        logout(request)
        return redirect('admin-login')
    
class AdminView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        user = request.user
        user_permission = ''
        
        if user.is_anonymous:
            return redirect('admin-login')
        elif user.is_superuser:
            user_permission = 'superuser'
        elif user.is_staff:
            user_permission = 'staff'
        
        next_ = self.request.GET.get('next')
        
        redirect_url = ''
        first_matching_url = ''
        pages = [y for x in admin_page.page_list.values() for y in x]
        
        
        for page in pages:
            if page.admin_permission == user_permission and hasattr(page, 'verbose_name'):
                redirect_url = page.url_name
                if not first_matching_url:
                    first_matching_url = redirect_url
                    
                if next_:
                    try:
                        redirect_url = reverse(redirect_url)
                    except NoReverseMatch:
                        continue
                    
                    if next_ == redirect_url:
                        return redirect(redirect_url)
                    continue
                
                return redirect(redirect_url)
                
        if first_matching_url:
            return redirect(first_matching_url)
        
        logout(request)
        return redirect('admin')


class TermsListView(generics.GenericAPIView):
    category = 'home'
    app_name = 'terms'
    title = '이용약관'
    verbose_name = title
    
    url_path, url_name, template, context = get_page_setting(category, app_name, 'list')
    model = Terms
    queryset = model.objects.filter(type__in=['privacy_policy', 'terms_of_service', 'rejection_email', 'instructor']).order_by('-id')
    serializer_class = TermsListAdminSerializer
    
    def get(self, request):
        context = self.context.copy()
        
        context['title'] = self.verbose_name

        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        # context['display_fields'] = self.get_serializer_class().Meta.display_fields
        context['rows'] = serializer.data
        
        return render(request, self.template, context=context)
    
    def put(self, request):
        data = request.data.dict()
        
        for k, v in data.items():
            obj = self.get_queryset().get(id=k)
            serializer = self.get_serializer(obj, data=json.loads(v), partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
        
        return Response({'message': 'success'})

class UserListView(generics.GenericAPIView):
    category = 'account'
    app_name = 'user'
    title = '일반 회원 관리'
    verbose_name = title
    
    url_path, url_name, template, context = get_page_setting(category, app_name, 'list')
    model = User
    
    queryset = model.objects.filter(is_active=True, is_staff=False, is_superuser=False).order_by('-id')
    # queryset = model.objects.filter(is_active=True, role__in=['normal', 'waiting_instructor_request']).order_by('-id')
    serializer_class = UserListAdminSerializer

    def get(self, request):
        context = self.context.copy()
        
        context['title'] = self.verbose_name
        context['checkbox'] = True
        context['excel_button'] = True
        context['filter_category'] = {
            'title': '가입 유형',
            'target_column': '회원종류', # 필터링 할 column의 verbose name 입력
            'filter_list': {
                # 필터링 할 값: 보여질 값
                '': '모두', # all에 대한 필터는 key가 공백, 가장 처음에 오는 값이 기본 필터
                '일반회원': '일반회원',
                '일반회원(강사회원 승인대기)': '일반회원(강사회원 승인대기)',
                '등록강사': '등록강사',
                '강사회원': '강사회원',
                '책임강사': '책임강사',
            }
        }

        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        context['display_fields'] = self.get_serializer_class().Meta.display_fields
        context['rows'] = serializer.data
        
        return render(request, self.template, context=context)
    
    def delete(self, request):
        user_list = request.data.get('checked_list', '')
        user_list = user_list.split(',')
        
        User.objects.filter(id__in=user_list).update(is_active=False)
        
        return Response({'message': 'success'})

class UserDetailView(generics.GenericAPIView):
    category = 'account'
    app_name = 'user'
    title = '일반 회원 관리'
    subtitle = '회원 정보'
    
    url_path, url_name, template, context = get_page_setting(category, app_name, 'detail')
    
    model = User
    queryset = model.objects.filter(is_active=True, is_staff=False)
    
    def get_serializer_class(self):
        if self.request.method == "PUT":
            return UserAdminSerializer

        return UserDetailAdminSerializer
        
    def get(self, request, pk):
        context = self.context.copy()
        context['pk'] = pk
        context['title'] = self.title
        context['subtitle'] = self.subtitle

        obj = self.get_object()
        serializer = self.get_serializer(obj)

        context['detail_fields'] = serializer.data
        
        return render(request, self.template, context=context)
    
    def put(self, request, pk):
        data = request.data.dict()
        data = {k: v for k, v in data.items() if v and v != 'undefined'}
        data['licenses'] = [{'image': x} for x in request.data.getlist('licenses')]
        
        obj = self.get_object()
        serializer = self.get_serializer(obj, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response({'message': 'success'})

class UserCreateView(generics.GenericAPIView):
    category = 'account'
    app_name = 'user'
    title = '일반 회원 관리'
    subtitle = '회원 생성'
    url_path, url_name, template, context = get_page_setting(category, app_name, 'create')
    
    model = User
    serializer_class = UserAdminSerializer
    
    def get(self, request):
        context = self.context.copy()
        
        context['title'] = self.title
        context['subtitle'] = self.subtitle
        
        serializer = self.get_serializer_class()

        context['create_fields'] = {k: v for k, v in serializer.Meta.fields_property.items() if not v.get('no_input')}

        return render(request, self.template, context=context)
    
    def post(self, request):
        data = request.data.dict()
        data['licenses'] = [{'image': x} for x in request.data.getlist('licenses')]
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class StaffListView(generics.GenericAPIView):
    category = 'account'
    app_name = 'staff'
    title = '관리자 관리'
    verbose_name = title
    
    url_path, url_name, template, context = get_page_setting(category, app_name, 'list')
    model = User
    
    queryset = model.objects.filter(is_active=True, is_staff=True).order_by('-is_superuser', 'id')
    # queryset = model.objects.filter(is_active=True, role__in=['normal', 'waiting_instructor_request']).order_by('-id')
    serializer_class = StaffListAdminSerializer

    def get(self, request):
        context = self.context.copy()
        
        context['title'] = self.verbose_name
        context['checkbox'] = True
        context['filter_category'] = {
            'title': '가입 유형',
            'target_column': '회원종류', # 필터링 할 column의 verbose name 입력
            'filter_list': {
                # 필터링 할 값: 보여질 값
                '': '모두', # all에 대한 필터는 key가 공백, 가장 처음에 오는 값이 기본 필터
                '일반회원': '일반회원',
                '일반회원(강사회원 승인대기)': '일반회원(강사회원 승인대기)',
                '등록강사': '등록강사',
                '강사회원': '강사회원',
                '책임강사': '책임강사',
            }
        }

        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        context['display_fields'] = self.get_serializer_class().Meta.display_fields
        context['rows'] = serializer.data
        
        return render(request, self.template, context=context)
    
    def delete(self, request):
        user_list = request.data.get('checked_list', '')
        user_list = user_list.split(',')
        
        User.objects.filter(id__in=user_list).update(is_active=False)
        
        return Response({'message': 'success'})

class StaffDetailView(generics.GenericAPIView):
    category = 'account'
    app_name = 'staff'
    title = '관리자 관리'
    subtitle = '관리자 상세'
    
    url_path, url_name, template, context = get_page_setting(category, app_name, 'detail')
    
    model = User
    queryset = model.objects.filter(is_active=True, is_staff=True)
    
    def get_serializer_class(self):
        if self.request.method == "PUT":
            return StaffAdminSerializer

        return StaffDetailAdminSerializer
        
    def get(self, request, pk):
        context = self.context.copy()
        context['pk'] = pk
        context['title'] = self.title
        context['subtitle'] = self.subtitle

        obj = self.get_object()
        serializer = self.get_serializer(obj)

        context['detail_fields'] = serializer.data
        
        return render(request, self.template, context=context)
    
    def put(self, request, pk):
        data = request.data.dict()
        data['licenses'] = [{'image': x} for x in request.data.getlist('licenses')]
        
        obj = self.get_object()
        serializer = self.get_serializer(obj, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response({'message': 'success'})

class StaffCreateView(generics.GenericAPIView):
    category = 'account'
    app_name = 'staff'
    title = '관리자 관리'
    subtitle = '관리자 생성'
    url_path, url_name, template, context = get_page_setting(category, app_name, 'create')
    
    model = User
    serializer_class = StaffAdminSerializer
    
    def get(self, request):
        context = self.context.copy()
        
        context['title'] = self.title
        context['subtitle'] = self.subtitle
        
        serializer = self.get_serializer_class()

        context['create_fields'] = {k: v for k, v in serializer.Meta.fields_property.items() if not v.get('no_input')}

        return render(request, self.template, context=context)
    
    def post(self, request):
        data = request.data.dict()
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
class ProductListView(generics.GenericAPIView):
    category = 'product'
    app_name = 'product_list'
    title = '상품 목록'
    verbose_name = title
    url_path, url_name, template, context = get_page_setting(category, app_name, 'list')
    
    serializer_class = ProductInfoAdminSerializer
    model = ProductInfo
    queryset = model.objects.all()
    
    def get(self, request):
        context = self.context.copy()
        
        queryset = ProductInfo.objects.filter(level=0)
        serializer = self.get_serializer(queryset, many=True)
        context['data'] = serializer.data

        return render(request, self.template, context=context)
    
    @transaction.atomic()
    def post(self, request):
        pk = request.data.get('pk', '')
        values = request.data.getlist('values', '')
        headers = request.data.get('headers', '').split('|')
        
        if headers == ['']:
            headers = []
            
        name = request.data.get('name', '')
        
        obj = self.get_queryset().get(pk=pk)
        
        child_obj = self.model.objects.create(name=name, parent=obj)
        #TODO 상품 등록 시 validate 추가해야 함
        #TODO 상품 삭제 추가해야 함
        for i, header in enumerate(headers):
            self.model.objects.create(name=header, value=values[i], parent=child_obj)
        
        return Response({})
    
    def put(self, request):
        data = {}
        pk = request.data.get('pk', '')
        obj = self.get_queryset().get(pk=pk)
        
        # option 수정 시
        if obj.level == 3:
            data['value'] = request.data.get('value')
            data['name'] = request.data.get('name')
            
        else:
            data['name'] = request.data.get('value')
        
        serializer = self.get_serializer(obj, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response({'message': 'success'})
    
    def delete(self, request):
        pk = request.data.get('pk', '')
        
        obj = self.get_queryset().get(pk=pk)
        obj.delete()
        # obj.delete_with_child()
        
        return Response({'message': 'success'})

    
class ReservationListView(generics.GenericAPIView):
    category = 'reservation'
    app_name = 'management'
    title = '예약 및 결제 관리'
    verbose_name = title
    url_path, url_name, template, context = get_page_setting(category, app_name, 'list')
    
    model = Reservation
    serializer_class = ReservationListAdminSerializer
    queryset = model.objects.filter().order_by('-id').select_related('calendar_date', 'product_option')

    def get(self, request):
        context = self.context.copy()
        
        context['title'] = self.title
        context['checkbox'] = False

        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        context['display_fields'] = self.get_serializer_class().Meta.display_fields
        context['rows'] = serializer.data
        
        return render(request, self.template, context=context)

class ReservationDetailView(generics.GenericAPIView):
    category = 'reservation'
    app_name = 'management'
    title = '예약 및 결제 관리'
    subtitle = '예약정보 상세'

    url_path, url_name, template, context = get_page_setting(category, app_name, 'detail')
    
    model = Reservation
    queryset = model.objects.filter()
    
    def get_serializer_class(self):
        return ReservationDetailAdminSerializer
        
    def get(self, request, pk):
        context = self.context.copy()
        
        context['pk'] = pk
        context['title'] = self.title
        context['subtitle'] = self.subtitle
        
        obj = self.get_object()
        serializer = self.get_serializer(obj)

        context['detail_fields'] = serializer.data
        
        return render(request, self.template, context=context)
    
    def put(self, request, pk):
        obj = self.get_object()
        
        serializer = self.get_serializer(obj, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response({'message': 'success'})

class InquiryListView(generics.GenericAPIView):
    category = 'article'
    app_name = 'inquiry'
    title = '1:1문의'
    verbose_name = title
    url_path, url_name, template, context = get_page_setting(category, app_name, 'list')
    
    model = Inquiry
    queryset = model.objects.filter().order_by('-id').select_related('author')
    serializer_class = InquiryListAdminSerializer

    def get(self, request):
        context = self.context.copy()
        
        context['title'] = self.title
        context['checkbox'] = True
        context['max_width_length'] = 25

        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        context['display_fields'] = self.get_serializer_class().Meta.display_fields
        context['rows'] = serializer.data
        
        return render(request, self.template, context=context)
    
    def delete(self, request):
        checked_id_list = request.data.get('checked_list', '')
        checked_id_list = checked_id_list.split(',')
        
        self.model.objects.filter(id__in=checked_id_list).delete()
        
        return Response({'message': 'success'})

class InquiryDetailView(generics.GenericAPIView):
    category = 'article'
    app_name = 'inquiry'
    title = '1:1문의'
    subtitle = '1:1문의 상세'
    
    url_path, url_name, template, context = get_page_setting(category, app_name, 'detail')
    model = Inquiry
    queryset = model.objects.filter()
    
    def get_serializer_class(self):
        # if self.request.method == "POST":
        #     return InquiryCommentAdminSerializer
        
        return InquiryDetailAdminSerializer
        
    def get(self, request, pk):
        context = self.context.copy()
        
        context['pk'] = pk
        context['title'] = self.title
        context['subtitle'] = self.subtitle
        
        obj = self.get_object()
        serializer = self.get_serializer(obj)

        context['detail_fields'] = serializer.data
        
        return render(request, self.template, context=context)
    
    # def post(self, request, pk):
    #     data = request.data.dict()
    #     data['author'] = request.user
    #     data['article'] = pk
        
    #     serializer = self.get_serializer(data=data)
    #     serializer.is_valid(raise_exception=True)
    #     serializer.save()
        
    #     return Response({'message': 'success'})
    
    def put(self, request, pk):
        data = request.data.dict()
        
        obj = self.get_object()
        serializer = self.get_serializer(obj, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response({'message': 'success'})


class InstructorListView(generics.GenericAPIView):
    category = 'article'
    app_name = 'instructor'
    title = '강사게시판'
    verbose_name = title
    url_path, url_name, template, context = get_page_setting(category, app_name, 'list')
    
    model = Instructor
    queryset = model.objects.filter().order_by('-id').select_related('author')
    serializer_class = InstructorListAdminSerializer

    def get(self, request):
        context = self.context.copy()
        
        context['title'] = self.verbose_name
        context['checkbox'] = True
        context['max_width_length'] = 25

        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        context['display_fields'] = self.get_serializer_class().Meta.display_fields
        context['rows'] = serializer.data
        
        return render(request, self.template, context=context)
    
    def delete(self, request):
        checked_id_list = request.data.get('checked_list', '')
        checked_id_list = checked_id_list.split(',')
        
        self.model.objects.filter(id__in=checked_id_list).delete()
        
        return Response({'message': 'success'})

class InstructorDetailView(generics.GenericAPIView):
    category = 'article'
    app_name = 'instructor'
    title = '강사게시판'
    subtitle = '강사게시판 상세'
    
    url_path, url_name, template, context = get_page_setting(category, app_name, 'detail')
    model = Instructor
    queryset = model.objects.filter()
    
    serializer_class = InstructorDetailAdminSerializer
        
    def get(self, request, pk):
        context = self.context.copy()
        
        context['pk'] = pk
        context['title'] = self.title
        context['subtitle'] = self.subtitle
        
        obj = self.get_object()
        serializer = self.get_serializer(obj)

        context['detail_fields'] = serializer.data
        
        return render(request, self.template, context=context)
    
    def post(self, request, pk):
        data = request.data.dict()
        data['is_visible'] = False if data['is_visible'] == 'true' else True
        obj = self.get_object()
        
        serializer = self.get_serializer(obj, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response({'message': 'success'})
    
class CommentListView(generics.GenericAPIView):
    category = 'article'
    app_name = 'comment'
    title = '댓글 관리'
    verbose_name = title
    url_path, url_name, template, context = get_page_setting(category, app_name, 'list')
    
    # queryset = model.objects.filter().order_by('-id')
    serializer_class = CommentSerializer

    def get(self, request):
        context = self.context.copy()
        
        context['title'] = self.verbose_name
        context['checkbox'] = True
        context['max_width_length'] = 20
        
        instructor_comments = InstructorComment.objects.all().select_related('author', 'article')
        instructor_comments = self.serializer_class(instructor_comments, many=True).data
        
        # inquiry_comments = InquiryComment.objects.all().select_related('author', 'article')
        # inquiry_comments = self.serializer_class(inquiry_comments, many=True).data
        
        all_comments = instructor_comments
        all_comments = sorted(all_comments, key=lambda x: x['created'], reverse=True)
        
        context['display_fields'] = self.get_serializer_class().display_fields
        context['rows'] = all_comments
        
        return render(request, self.template, context=context)
    
    def delete(self, request):
        category_list = {
            "강사게시판": InstructorComment,
            # "1:1문의": InquiryComment,
        }
        
        checked_list = json.loads(request.data.get('checked_list', '{}'))
        
        for category, checked_id_list in checked_list.items():
            category_list[category].objects.filter(id__in=checked_id_list).delete()
            
        return Response({'message': 'success'})

class CommentDetailView(generics.GenericAPIView):
    category = 'article'
    app_name = 'comment'
    title = '댓글'
    subtitle = '댓글 상세'
    
    url_path, url_name, template, context = get_page_setting(category, app_name, 'detail')
    url_path = 'comment/<str:category>/<int:pk>'
    
    serializer_class = CommentSerializer
        
    def get(self, request, category, pk):
        context = self.context.copy()
        
        context['pk'] = pk
        context['pk_category'] = category
        context['title'] = self.title
        context['subtitle'] = self.subtitle
        
        if category == 'instructor':
            obj = InstructorComment.objects.get(id=pk)
            
        elif category == 'inquiry':
            obj = InquiryComment.objects.get(id=pk)
        
        
        serializer = self.get_serializer(obj)

        context['detail_fields'] = serializer.data
        
        return render(request, self.template, context=context)
    
    def post(self, request, pk):
        data = request.data.dict()
        data['is_visible'] = False if data['is_visible'] == 'true' else True
        obj = self.get_object()
        
        serializer = self.get_serializer(obj, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response({'message': 'success'})


class ReportListView(generics.GenericAPIView):
    category = 'article'
    app_name = 'report'
    title = '신고 관리'
    verbose_name = title
    url_path, url_name, template, context = get_page_setting(category, app_name, 'list')
    # queryset = model.objects.filter().order_by('-id')
    serializer_class = ReportSerializer

    def get(self, request):
        context = self.context.copy()
        
        context['title'] = self.verbose_name
        context['checkbox'] = True
        context['max_width_length'] = 20
        
        instructor_reports = InstructorReport.objects.all().select_related('user', 'target')
        instructor_reports = self.serializer_class(instructor_reports, many=True).data
        
        inquiry_reports = InquiryReport.objects.all().select_related('user', 'target')
        inquiry_reports = self.serializer_class(inquiry_reports, many=True).data
        
        instructor_comment_reports = InstructorCommentReport.objects.all().select_related('user', 'target')
        instructor_comment_reports = self.serializer_class(instructor_comment_reports, many=True).data
        
        
        # inquiry_comment_reports = InquiryCommentReport.objects.all().select_related('user', 'target')
        # inquiry_comment_reports = self.serializer_class(inquiry_comment_reports, many=True).data
        
        # all_reports = instructor_reports + inquiry_reports
        all_reports = instructor_reports + inquiry_reports + instructor_comment_reports
        all_reports = sorted(all_reports, key=lambda x: x['datetime'], reverse=True)
        
        context['display_fields'] = self.get_serializer_class().display_fields
        context['rows'] = all_reports
        
        return render(request, self.template, context=context)
    
    def delete(self, request):
        category_list = {
            "강사게시판": InstructorReport,
            "강사게시판 댓글": InstructorCommentReport,
            "1:1문의": InquiryReport,
            # "1:1문의 댓글": InquiryCommentReport,
        }
        
        checked_list = json.loads(request.data.get('checked_list', '{}'))
        
        for category, checked_id_list in checked_list.items():
            category_list[category].objects.filter(id__in=checked_id_list).delete()

        return Response({'message': 'success'})
class ReportDetailView(generics.GenericAPIView):
    category = 'article'
    app_name = 'report'
    title = '신고 관리'
    subtitle = '신고 상세'
    
    url_path, url_name, template, context = get_page_setting(category, app_name, 'detail')
    url_path = 'report/<str:category>/<int:pk>'
    
    serializer_class = ReportSerializer
        
    def get(self, request, category, pk):
        context = self.context.copy()
        
        context['pk'] = pk
        context['pk_category'] = category
        context['title'] = self.title
        context['subtitle'] = self.subtitle
        
        if category == 'instructor':
            context['category'] = 'article'
            obj = InstructorReport.objects.get(id=pk)
            
        elif category == 'inquiry':
            context['category'] = 'article'
            obj = InquiryReport.objects.get(id=pk)
            
        # elif category == 'comment_inquiry':
        #     context['category'] = 'comment'
        #     obj = InquiryCommentReport.objects.get(id=pk)
        #     context['target'] = obj.target.article
        #     context['target_url'] = 'inquiry'
            
            
        elif category == 'comment_instructor':
            context['category'] = 'comment'
            obj = InstructorCommentReport.objects.get(id=pk)
            context['target'] = obj.target.article
            context['target_url'] = 'instructor'
        
        
        serializer = self.get_serializer(obj)

        context['detail_fields'] = serializer.data
        
        return render(request, self.template, context=context)
    
    def post(self, request, pk):
        data = request.data.dict()
        data['is_visible'] = False if data['is_visible'] == 'true' else True
        obj = self.get_object()
        
        serializer = self.get_serializer(obj, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response({'message': 'success'})

class FaqListView(generics.GenericAPIView):
    category = 'etc'
    app_name = 'faq'
    title = '자주하는 질문'
    verbose_name = title
    url_path, url_name, template, context = get_page_setting(category, app_name, 'list')
    
    model = Faq
    queryset = model.objects.filter().order_by('-order', '-id')
    serializer_class = FaqListAdminSerializer

    def get(self, request):
        context = self.context.copy()
        
        context['title'] = self.verbose_name
        context['checkbox'] = True
        context['max_width_length'] = 25

        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        context['display_fields'] = self.get_serializer_class().Meta.display_fields
        context['rows'] = serializer.data
        
        return render(request, self.template, context=context)
    
    def delete(self, request):
        checked_id_list = request.data.get('checked_list', '')
        checked_id_list = checked_id_list.split(',')
        
        self.model.objects.filter(id__in=checked_id_list).delete()
        
        return Response({'message': 'success'})

class FaqDetailView(generics.GenericAPIView):
    category = 'etc'
    app_name = 'faq'
    title = '자주하는 질문'
    subtitle = '자주하는 질문 상세'
    
    url_path, url_name, template, context = get_page_setting(category, app_name, 'detail')
    model = Faq
    queryset = model.objects.filter()
    
    serializer_class = FaqDetailAdminSerializer
    
    def get_serializer_class(self):
        if self.request.method == "PUT":
            return FaqAdminSerializer

        return FaqDetailAdminSerializer
        
    def get(self, request, pk):
        context = self.context.copy()
        
        context['pk'] = pk
        context['title'] = self.title
        context['subtitle'] = self.subtitle
        
        obj = self.get_object()
        serializer = self.get_serializer(obj)

        context['detail_fields'] = serializer.data
        
        return render(request, self.template, context=context)
    
    def put(self, request, pk):
        data = request.data.dict()
        
        obj = self.get_object()
        serializer = self.get_serializer(obj, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response({'message': 'success'})

class FaqCreateView(generics.GenericAPIView):
    category = 'etc'
    app_name = 'faq'
    title = '자주하는 질문'
    subtitle = '자주하는 질문 생성'
    url_path, url_name, template, context = get_page_setting(category, app_name, 'create')
    
    model = Faq
    serializer_class = FaqAdminSerializer
    
    def get(self, request):
        context = self.context.copy()
        
        context['title'] = self.title
        context['subtitle'] = self.subtitle
        
        serializer = self.get_serializer_class()

        context['create_fields'] = {k: v for k, v in serializer.Meta.fields_property.items() if not v.get('no_input')}

        return render(request, self.template, context=context)
    
    def post(self, request):
        data = request.data.dict()
        data = {k: v for k, v in data.items() if v}
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
class NoticeListView(generics.GenericAPIView):
    category = 'etc'
    app_name = 'notice'
    title = '공지사항'
    verbose_name = title
    url_path, url_name, template, context = get_page_setting(category, app_name, 'list')
    
    model = Notice
    queryset = model.objects.filter().order_by('-id')
    serializer_class = NoticeListAdminSerializer

    def get(self, request):
        context = self.context.copy()
        
        context['title'] = self.verbose_name
        context['checkbox'] = True
        context['max_width_length'] = 25

        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        context['display_fields'] = self.get_serializer_class().Meta.display_fields
        context['rows'] = serializer.data
        
        return render(request, self.template, context=context)
    
    def delete(self, request):
        checked_id_list = request.data.get('checked_list', '')
        checked_id_list = checked_id_list.split(',')
        
        self.model.objects.filter(id__in=checked_id_list).delete()
        
        return Response({'message': 'success'})

class NoticeDetailView(generics.GenericAPIView):
    category = 'etc'
    app_name = 'notice'
    title = '공지사항'
    subtitle = '공지사항 상세'
    
    url_path, url_name, template, context = get_page_setting(category, app_name, 'detail')
    model = Notice
    queryset = model.objects.filter()
    
    serializer_class = NoticeDetailAdminSerializer
    
    def get_serializer_class(self):
        if self.request.method == "PUT":
            return NoticeAdminSerializer

        return NoticeDetailAdminSerializer
        
    def get(self, request, pk):
        context = self.context.copy()
        
        context['pk'] = pk
        context['title'] = self.title
        context['subtitle'] = self.subtitle
        
        obj = self.get_object()
        serializer = self.get_serializer(obj)

        context['detail_fields'] = serializer.data
        
        return render(request, self.template, context=context)
    
    def put(self, request, pk):
        data = request.data.dict()
        data = {k: v for k, v in data.items() if v and v != 'undefined'}
        
        obj = self.get_object()
        serializer = self.get_serializer(obj, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response({'message': 'success'})

class NoticeCreateView(generics.GenericAPIView):
    category = 'etc'
    app_name = 'notice'
    title = '공지사항'
    subtitle = '공지사항 생성'
    url_path, url_name, template, context = get_page_setting(category, app_name, 'create')
    
    model = Notice
    serializer_class = NoticeAdminSerializer
    
    def get(self, request):
        context = self.context.copy()
        
        context['title'] = self.title
        context['subtitle'] = self.subtitle
        
        serializer = self.get_serializer_class()

        context['create_fields'] = {k: v for k, v in serializer.Meta.fields_property.items() if not v.get('no_input')}

        return render(request, self.template, context=context)
    
    def post(self, request):
        data = request.data.dict()
        data = {k: v for k, v in data.items() if v and v != 'undefined'}
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# home
admin_page.register(TermsListView)

# account
admin_page.register(UserListView)
admin_page.register(UserDetailView)
admin_page.register(UserCreateView)

admin_page.register(StaffListView)
admin_page.register(StaffDetailView)
admin_page.register(StaffCreateView)

# product
admin_page.register(ProductListView)
# admin_page.register(ProductRegisterView)

# reservation
admin_page.register(ReservationListView, admin_permission='staff')
admin_page.register(ReservationDetailView, admin_permission='staff')

# article
admin_page.register(InquiryListView, admin_permission='staff')
admin_page.register(InquiryDetailView, admin_permission='staff')

admin_page.register(InstructorListView)
admin_page.register(InstructorDetailView)

admin_page.register(CommentListView)
admin_page.register(CommentDetailView)

admin_page.register(ReportListView)
admin_page.register(ReportDetailView)

# etc
admin_page.register(FaqListView)
admin_page.register(FaqDetailView)
admin_page.register(FaqCreateView)

admin_page.register(NoticeListView)
admin_page.register(NoticeDetailView)
admin_page.register(NoticeCreateView)
