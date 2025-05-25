"""theme URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings


urlpatterns = [
    path('admin/', admin.site.urls),
    path('custom_admin/', include('custom_admin.urls')),
    path('api/account/', include('account.urls')),
    path('api/article/', include('article.urls')),
    path('api/fileserver/', include('fileserver.urls')),
    path('api/product/', include('product.urls')),
    path('api/payment/', include('payment.urls')),
    path('api/staticlist/', include('staticlist.urls')),
]

if settings.DEBUG:
    from drf_yasg.generators import OpenAPISchemaGenerator
    from drf_yasg.views import get_schema_view
    from drf_yasg       import openapi
    from rest_framework.permissions import IsAuthenticated
    from django.contrib.auth.decorators import login_required
    from django.conf.urls.static import static

    class BothHttpAndHttpsSchemaGenerator(OpenAPISchemaGenerator):
        def get_schema(self, request=None, public=False):
            schema = super().get_schema(request, public)
            schema.schemes = ["http", "https"]
            return schema

    schema_view = get_schema_view(
        openapi.Info(
            title=f"{settings.SETTINGS_MODULE.split('.')[0]} API Swagger",
            default_version='v1',
            description="API Description",
        ),
        public=False,
        generator_class=BothHttpAndHttpsSchemaGenerator,
        permission_classes=(IsAuthenticated, ),
    )

    urlpatterns += [
        re_path(r'^swagger(?P<format>\.json|\.yaml)$', login_required(schema_view.without_ui(cache_timeout=0)), name='schema-json'),
        re_path(r'^swagger/$', login_required(schema_view.with_ui('swagger', cache_timeout=0)), name='schema-swagger-ui'),
        re_path(r'^redoc/$', login_required(schema_view.with_ui('redoc', cache_timeout=0)), name='schema-redoc'),
    ] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
