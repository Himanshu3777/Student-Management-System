from django.urls import path
from . import views

urlpatterns = [
    # List
    path('', views.student_list, name='student_list'),

    # Add Student
    path('add/', views.student_add, name='student_add'),

    # List Data (AJAX)
    path('data/', views.student_list_data, name='student_list_data'),

    # Detail page
    path('detail/<int:id>/', views.student_details, name='student_details'),

    # Detail Data (AJAX)
    path('data/<int:id>/', views.student_data, name='student_data'),

    # Edit
    path('edit/<int:id>/', views.student_edit, name='student_edit'),
]