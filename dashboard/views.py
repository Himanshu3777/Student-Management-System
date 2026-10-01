from django.shortcuts import render

from accounts.models import Registration
from attendance.models import Attendance, AttendanceRecord
from courses.models import Course
from results.models import Result
from students.models import Student
from teachers.models import Teacher


# Create your views here.

def home(request):


    registrations = Registration.objects.all()
    attendance_records = AttendanceRecord.objects.all()
    attendance = Attendance.objects.all()
    courses = Course.objects.all()
    results = Result.objects.all()
    students = Student.objects.all()
    teachers = Teacher.objects.all()

    return render(
        request,
        "index.html",
        {
            "registrations": registrations,
            "att_recor": attendance_records,
            "att": attendance,
            "course": courses,
            "result": results,
            "student": students,
            "teacher": teachers,
        }
    )
