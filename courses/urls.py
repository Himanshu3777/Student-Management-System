from django.urls import path
from . import views

urlpatterns = [
    path('', views.course_list, name='course_list'),
    path('add/', views.course_add, name='course_add'),
    
    path('<int:id>/', views.course_detail, name='course_detail'),

    path('<int:id>/edit/', views.course_edit, name='course_edit'),
    path('<int:id>/delete/', views.course_delete, name='course_delete'),
]