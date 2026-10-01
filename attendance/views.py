from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.urls import reverse
from .models import Attendance, AttendanceRecord
from courses.models import Course
from accounts.models import Registration


# =============== ATTENDANCE LIST ===============
def attendance_list(request):
    records = AttendanceRecord.objects.all().select_related(
        'student', 'attendance', 'attendance__course'
    ).order_by('-attendance__date', 'student__roll')
    return render(request, "attendance_list.html", {"attendance": records})


# =============== ATTENDANCE DETAIL ===============
def attendance_detail(request, id):
    record = AttendanceRecord.objects.select_related(
        'student', 'attendance', 'attendance__course'
    ).get(id=id)
    return render(request, "attendance_detail.html", {"record": record})


# =============== MARK ATTENDANCE ===============
def mark_attendance(request):
    # ─── GET — Form dikhao ───
    if request.method == "GET":
        course = Course.objects.all()
        student = Registration.objects.all()
        return render(request, "attendance.html", {
            "course": course,
            "student": student,
        })

    # ─── POST — AJAX handle ───
    try:
        date = request.POST.get("date")
        course_id = request.POST.get("course")
        semester = request.POST.get("semester")

        # Validation
        if not date or not course_id or not semester:
            return JsonResponse({
                "success": False,
                "message": "Date, Course aur Semester required hain.",
            })

        course = Course.objects.filter(id=course_id).first()
        if not course:
            return JsonResponse({
                "success": False,
                "message": "Selected course not found.",
            })

        students = Registration.objects.filter(course=course)

        # Attendance session banao
        attendance = Attendance.objects.create(
            date=date,
            course=course,
            semester=semester,
        )

        # Har student ka AttendanceRecord banao
        for student in students:
            status_value = request.POST.get(f"status_{student.id}")   # "present"/"absent"

            # ⭐ CRITICAL — Boolean conversion
            status = (status_value == 'present')                      # True / False

            # Debug (temporary)
            print(f"Student {student.id}: '{status_value}' → {status}")

            AttendanceRecord.objects.create(
                attendance=attendance,
                student=student,
                status=status,                                        # ⭐ Boolean
            )

        # AJAX response
        return JsonResponse({
            "success": True,
            "message": "Attendance saved successfully!",
            "redirect": reverse('attendance_list'),
        })

    except Exception as e:
        return JsonResponse({
            "success": False,
            "message": str(e),
        })