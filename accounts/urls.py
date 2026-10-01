from django.urls import path
from . import views

# JS me AJAX ko  use karte time ham fetch(..) me jo path ko send karte hai vahi samth path django ki hai hoti hai jisase vah asani reseive kar sakta hai


urlpatterns = [
    path('login/', views.login, name='login'),
    path('register/', views.register, name='register'),
    path('profile/', views.profile, name='profile'),              # ← HTML
    path('logout/', views.logout, name='logout'),
]

