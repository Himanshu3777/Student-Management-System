from django.db import models

# Create your models here.
class Course(models.Model):
    courses_name=models.CharField(max_length=100)
    courses_code=models.CharField(max_length=20, unique=True)
    during=models.CharField(max_length=50)
    total_credits=models.PositiveIntegerField(default=0)
    fee_par_year=models.DecimalField(max_digits=10, decimal_places=2)
# (value, display_name) for choices formate
    status=models.CharField(max_length=20,
                            choices=[
            ('Active', 'Active'),
            ('Pending', 'Pending'),
            ('Inactive', 'Inactive'),
                            ], default='Active')
    description=models.TextField(blank=True)

    def __str__(self):
        return self.courses_name