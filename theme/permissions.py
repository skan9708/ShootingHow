from rest_framework.permissions import BasePermission, IsAuthenticated
from rest_framework.exceptions import APIException
from rest_framework import status

def check_login(func):
    def wrapper(self, request, view):
        if request.user.is_anonymous:
            raise GenericAPIException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail={"error": "서비스를 이용하기 위해 로그인 해주세요."}
            )
        
        return func(self, request, view)
            
    return wrapper

class GenericAPIException(APIException):
    def __init__(self, status_code, detail=None, code=None):
        self.status_code=status_code
        super().__init__(detail=detail, code=code)
        
class IsAuthenticated(BasePermission):
    '''로그인 한 사용자만 사용 가능'''
    @check_login
    def has_permission(self, request, view):
        return True
    
class IsAuthenticatedOrCreateOnly(BasePermission):
    '''로그인 한 사용자가 아니라면 생성만 가능'''
    SAFE_METHODS = ('POST')
    message = '접근 권한이 없습니다.'

    @check_login
    def has_permission(self, request, view):
        return bool(
            request.method in self.SAFE_METHODS or
            request.user and
            request.user.is_authenticated
        )

class IsAuthenticatedAndIsInstructor(BasePermission):
    '''강사만 접근 가능'''
    message = '접근 권한이 없습니다.'
    
    @check_login
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.role not in ['normal', 'waiting_instructor_request'] or
             request.user.is_staff or
             request.user.is_superuser)
        )
        
class IsAdminUser(BasePermission):
    '''admin 사용자만 접근 가능'''
    message = '접근 권한이 없습니다.'
    
    @check_login
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_staff)
