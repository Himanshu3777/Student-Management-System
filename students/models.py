from django.db import models
from courses.models import Course


# Create your models here.
class Student(models.Model):

    name = models.CharField(max_length=100)

    roll_number = models.CharField(
        max_length=100,
        unique=True
    )

    email = models.EmailField()

    phone = models.CharField(max_length=13)

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='students'
    )

    gender = models.CharField(
        max_length=10,
        choices=[
            ('male', 'Male'),
            ('female', 'Female'),
            ('other', 'Other')
        ],
        blank=True
    )

    dob = models.DateField(
        blank=True,
        null=True
    )

    status = models.CharField(
        max_length=10,
        choices=[
            ('active', 'Active'),
            ('pending', 'Pending'),
            ('inactive', 'Inactive')
        ],
        default='active'
    )

    address = models.TextField(
        blank=True
    )

    def __str__(self):
        return f"{self.name} - {self.roll_number}"