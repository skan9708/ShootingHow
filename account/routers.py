from rest_framework.routers import Route, DynamicRoute, DefaultRouter

class UserRouter(DefaultRouter):
    routes = [
        Route(
            url=r'^{prefix}{trailing_slash}$',
            mapping={
                'get': 'retrieve',
                'post': 'create',
                'put': 'update',
                'delete': 'destroy'
            },
            name='{basename}-api',
            detail=False,
            initkwargs={'suffix': 'List'}
        ),
        DynamicRoute(
            url=r'^{prefix}/{url_path}{trailing_slash}$',
            name='{basename}-{url_name}',
            detail=False,
            initkwargs={}
        ),
    ]