from django.urls import path
from . import views

urlpatterns = [
    # List
    path("", views.result_list, name="result_list"),

    # List Data (AJAX)
    path("data/", views.result_list_data, name="result_list_data"),

    # Add
    path("add/", views.result_add, name="result_add"),

    # Detail page
    path("detail/<int:id>/", views.result_detail, name="result_detail"),

    # Detail Data (AJAX)
    path("data/<int:id>/", views.result_data, name="result_data"),

    # Edit
    path("edit/<int:id>/", views.result_edit, name="result_edit"),

    # Delete (AJAX)
    path("delete/<int:id>/", views.result_delete, name="result_delete"),
]