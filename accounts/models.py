from django.db import models
from courses.models import Course
# Course ye assume hai and isaka use ham course ke database me karenge


# Create your models here.
class Registration(models.Model):
    fname = models.CharField(max_length=100, blank=False)
    lname = models.CharField(max_length=100, blank=False)
    username = models.CharField(max_length=100,blank=False,unique=True)
    email = models.EmailField(unique=True,blank=False)
    
    password = models.CharField(max_length=255,blank=False)
    
    phone = models.CharField(max_length=15,blank=False,unique=True)
    roll = models.CharField(max_length=20,blank=False,unique=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    gender = models.CharField(max_length=10,blank=False)
    DOB = models.DateField(blank=True,null=True)
    address = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)  # 👈 null=True
    last_login = models.DateTimeField(null=True, blank=True)                      # 👈 null=True

    def __str__(self):
        return self.fname