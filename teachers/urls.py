from django.urls import path
from . import views

urlpatterns = [
    # List
    path('', views.teacher_list, name='teacher_list'),

    # List Data (AJAX)
    path('data/', views.teacher_list_data, name='teacher_list_data'),

    # Add
    path('add/', views.teacher_add, name='teacher_add'),

    # Detail page
    path('detail/<int:id>/', views.teacher_detail, name='teacher_detail'),

    # Detail Data (AJAX)
    path('data/<int:id>/', views.teacher_data, name='teacher_data'),

    # Edit
    path('edit/<int:id>/', views.teacher_edit, name='teacher_edit'),

    # Delete
    path('delete/<int:id>/', views.teacher_delete, name='teacher_delete'),
]