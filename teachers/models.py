from django.db import models

# Create your models here.
class Teacher(models.Model):
    fname=models.CharField(max_length=100)
    employee_id=models.CharField(max_length=20, unique=True)
    email=models.EmailField(blank=False)
    phone=models.CharField(max_length=13, blank=True)
    subject=models.CharField(max_length=100)
    qualification=models.CharField(max_length=100, blank=True)
    experience=models.PositiveIntegerField(default=0)
    joining_date=models.DateField(blank=True)
    address=models.TextField(blank=True)

# database me teacher ko acces karenge to hame object milega but jab ham is method ka use karte hai to hame us student ka details milta hai

    def __str__(self):
        return self.fname