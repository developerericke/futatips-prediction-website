from django.contrib import admin
from django.urls import path,include
from . import views
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns = [
    path('admin/', admin.site.urls),
    path('index/',views.indexpage),
    path('view-prediction/<slug:match>/<str:kickoff>/',views.viewtip),
    path('authers/',views.authers),
    path('filtered/<str:query>/',views.filtered),
    path('accumulator/',views.accumulators),
    path('admins/',include('backend.urls')),
    path('about/', views.indexpage),
    path('',views.indexpage)
]


urlpatterns += staticfiles_urlpatterns()