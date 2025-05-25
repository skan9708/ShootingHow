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

from custom_admin import views
from custom_admin.decorators import admin_required, staff_required

urlpatterns = [
    path('', views.AdminView.as_view(), name='admin'),
    path('login/', views.AdminLoginView.as_view(), name='admin-login'),
    path('logout/', views.AdminLogoutView.as_view(), name='admin-logout'),
    ]

for category, pages in views.admin_page.page_list.items():
    for page in pages:
        if page.admin_permission == 'staff':
            view = staff_required(page.as_view())
        else:
            view = admin_required(page.as_view())
            
        urlpatterns.append(
            path(f'{category}/{page.url_path}/', view, name=page.url_name)
        )

# for path_, name in page.urls.items():
            # urlpatterns.append(
                # path(f'{category}/{path_}{"" if path_.endswith("/") else "/"}', admin_required(page.as_view()), name=name)
            # )
# for url_ in urlpatterns:
#     url_.callback = admin_required(url_.callback)
    