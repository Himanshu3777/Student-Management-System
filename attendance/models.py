from django.db import models
from accounts.models import Registration
from courses.models import Course



class Attendance(models.Model):
    date=models.DateField()

    course=models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='attendances'
    )

    semester=models.PositiveIntegerField()
    created_at=models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"{self.course.courses_name} - Semester {self.semester} - {self.date}"


class AttendanceRecord(models.Model):
    attendance=models.ForeignKey(
        Attendance,
        on_delete=models.CASCADE,
        related_name='records'
    )

    student=models.ForeignKey(
        Registration,
        on_delete=models.CASCADE,
        related_name='attendance_records'
    )

    status=models.BooleanField(default=True)

    def __str__(self):
        status="Present" if self.status else "Absent"
        return f"{self.student.fname} {self.student.lname} -{status}"

