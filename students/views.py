from django.shortcuts import render, redirect
from django.http import JsonResponse

from accounts.models import Registration
from courses.models import Course
from .models import Student


# ═══════════════════════════════════════════════════════════
#   STUDENT LIST — HTML page
# ═══════════════════════════════════════════════════════════
def student_list(request):
    return render(request, "student_list.html")


# ═══════════════════════════════════════════════════════════
#   STUDENT LIST DATA — JSON (AJAX)
# ═══════════════════════════════════════════════════════════
def student_list_data(request):
    students = Registration.objects.select_related(
        'course'
    ).all().order_by('-id')

    data = []

    for s in students:
        data.append({
            "id": s.id,
            "fname": s.fname,
            "lname": s.lname,
            "full_name": f"{s.fname} {s.lname}",
            "email": s.email,
            "phone": s.phone,
            "roll": s.roll,
            "course": s.course.courses_name if s.course else "—",
            "gender": s.gender,
            "DOB": str(s.DOB) if s.DOB else "",
            "address": s.address,
        })

    return JsonResponse({
        "success": True,
        "count": len(data),
        "students": data,
    })


# ═══════════════════════════════════════════════════════════
#   STUDENT DETAIL — HTML page
# ═══════════════════════════════════════════════════════════
def student_details(request, id):
    return render(request, "student_detail.html", {
        "student_id": id,
    })


# ═══════════════════════════════════════════════════════════
#   STUDENT DATA — JSON (AJAX)
# ═══════════════════════════════════════════════════════════
def student_data(request, id):
    student = Registration.objects.select_related(
        'course'
    ).filter(id=id).first()

    if not student:
        return JsonResponse({
            "success": False,
            "message": "Student not found."
        }, status=404)

    return JsonResponse({
        "success": True,
        "student": {
            "id": student.id,
            "fname": student.fname,
            "lname": student.lname,
            "full_name": f"{student.fname} {student.lname}",
            "initials": (
                f"{student.fname[0]}{student.lname[0]}"
            ).upper(),
            "email": student.email,
            "phone": student.phone,
            "roll": student.roll,
            "course": (
                student.course.courses_name
                if student.course
                else "—"
            ),
            "gender": student.gender or "—",
            "DOB": str(student.DOB) if student.DOB else "—",
            "address": student.address or "—",
        }
    })


# ═══════════════════════════════════════════════════════════
#   STUDENT EDIT — HTML page
# ═══════════════════════════════════════════════════════════
def student_edit(request, id):
    student = Registration.objects.filter(id=id).first()

    if not student:
        return redirect("student_list")

    course = Course.objects.all()

    return render(request, "student_edit.html", {
        "student": student,
        "course": course,
    })