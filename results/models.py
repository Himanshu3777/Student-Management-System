from django.db import models
from accounts.models import Registration
from courses.models import Course


class Result(models.Model):

    EXAM_TYPE_CHOICES = [
        ('Mid-Term', 'Mid-Term'),
        ('Final', 'Final'),
        ('Quiz', 'Quiz'),
        ('Assignment', 'Assignment'),
    ]

    STATUS_CHOICES = [
        ('Pass', 'Pass'),
        ('Fail', 'Fail'),
    ]

    student = models.ForeignKey(
        Registration,
        on_delete=models.CASCADE,
        related_name='results'
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='results'
    )

    exam_type = models.CharField(
        max_length=20,
        choices=EXAM_TYPE_CHOICES
    )

    semester = models.PositiveIntegerField()

    total_marks = models.PositiveIntegerField()

    obtained_marks = models.PositiveIntegerField()

    result_status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.fname} {self.student.lname} - {self.course.courses_name} - {self.exam_type}"