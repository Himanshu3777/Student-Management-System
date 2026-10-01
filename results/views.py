from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.urls import reverse

from courses.models import Course
from accounts.models import Registration
from .models import Result


# ═══════════════════════════════════════════════════════════
#   RESULT LIST — HTML page
# ═══════════════════════════════════════════════════════════
def result_list(request):
    return render(request, "result_list.html")


# ═══════════════════════════════════════════════════════════
#   RESULT LIST DATA — JSON (AJAX)
# ═══════════════════════════════════════════════════════════
def result_list_data(request):
    results = Result.objects.select_related('student', 'course').all().order_by('-id')

    data = []
    for r in results:
        data.append({
            "id": r.id,
            "student_name": f"{r.student.fname} {r.student.lname}",
            "roll": r.student.roll,
            "course": r.course.courses_name,
            "exam_type": r.exam_type,
            "total_marks": r.total_marks,
            "obtained_marks": r.obtained_marks,
            "result_status": r.result_status,
        })

    return JsonResponse({
        "success": True,
        "count": len(data),
        "results": data,
    })


# ═══════════════════════════════════════════════════════════
#   RESULT ADD — GET form + POST save
# ═══════════════════════════════════════════════════════════
def result_add(request):
    if request.method == "GET":
        course = Course.objects.all()
        student = Registration.objects.all()
        return render(request, "result_add.html", {
            "course": course,
            "stude": student,
        })

    if request.method == "POST":
        try:
            student_id = request.POST.get("student")
            course_id = request.POST.get("course")
            exam_type = request.POST.get("exam_type")
            semester = request.POST.get("semester")
            total_marks = request.POST.get("total_marks")
            obtained_marks = request.POST.get("obtained_marks")
            result_status = request.POST.get("status")

            # Validation
            if not all([student_id, course_id, exam_type, semester, total_marks, obtained_marks, result_status]):
                return JsonResponse({
                    "success": False,
                    "message": "Please fill in all required fields."
                }, status=400)

            student_obj = Registration.objects.filter(id=student_id).first()
            if not student_obj:
                return JsonResponse({
                    "success": False,
                    "message": "Student not found."
                }, status=400)

            course_obj = Course.objects.filter(id=course_id).first()
            if not course_obj:
                return JsonResponse({
                    "success": False,
                    "message": "Course not found."
                }, status=400)

            Result.objects.create(
                student=student_obj,
                course=course_obj,
                exam_type=exam_type,
                semester=semester,
                total_marks=total_marks,
                obtained_marks=obtained_marks,
                result_status=result_status,
            )

            return JsonResponse({
                "success": True,
                "message": "Result saved successfully.",
                "redirect": reverse("result_list"),
            })

        except Exception as e:
            return JsonResponse({
                "success": False,
                "message": str(e)
            }, status=400)

    return JsonResponse({
        "success": False,
        "message": "Invalid request method."
    }, status=400)


# ═══════════════════════════════════════════════════════════
#   RESULT DETAIL — HTML page (JS fetch karega)
# ═══════════════════════════════════════════════════════════
def result_detail(request, id):
    return render(request, "result_detail.html", {
        "result_id": id,
    })


# ═══════════════════════════════════════════════════════════
#   RESULT DATA — JSON (AJAX)
# ═══════════════════════════════════════════════════════════
def result_data(request, id):
    result = Result.objects.select_related('student', 'course').filter(id=id).first()

    if not result:
        return JsonResponse({
            "success": False,
            "message": "Result not found."
        }, status=404)

    percentage = 0
    if result.total_marks:
        percentage = round((result.obtained_marks / result.total_marks) * 100, 2)

    return JsonResponse({
        "success": True,
        "result": {
            "id": result.id,
            "student_name": f"{result.student.fname} {result.student.lname}",
            "student_roll": result.student.roll,
            "student_initials": f"{result.student.fname[0]}{result.student.lname[0]}".upper(),
            "course": result.course.courses_name,
            "exam_type": result.exam_type,
            "semester": result.semester,
            "total_marks": result.total_marks,
            "obtained_marks": result.obtained_marks,
            "percentage": percentage,
            "result_status": result.result_status,
            "created_at": result.created_at.strftime("%b %d, %Y"),
        }
    })


# ═══════════════════════════════════════════════════════════
#   RESULT EDIT — GET form + POST update
# ═══════════════════════════════════════════════════════════
def result_edit(request, id):
    result = Result.objects.select_related('student', 'course').filter(id=id).first()

    if not result:
        return redirect("result_list")

    if request.method == "GET":
        course = Course.objects.all()
        student = Registration.objects.all()
        return render(request, "result_edit.html", {
            "result": result,
            "course": course,
            "stude": student,
        })

    if request.method == "POST":
        try:
            student_id = request.POST.get("student")
            course_id = request.POST.get("course")
            exam_type = request.POST.get("exam_type")
            semester = request.POST.get("semester")
            total_marks = request.POST.get("total_marks")
            obtained_marks = request.POST.get("obtained_marks")
            result_status = request.POST.get("status")

            if not all([student_id, course_id, exam_type, semester, total_marks, obtained_marks, result_status]):
                return JsonResponse({
                    "success": False,
                    "message": "Please fill in all fields."
                }, status=400)

            student_obj = Registration.objects.filter(id=student_id).first()
            course_obj = Course.objects.filter(id=course_id).first()

            if not student_obj or not course_obj:
                return JsonResponse({
                    "success": False,
                    "message": "Student or Course not found."
                }, status=400)

            result.student = student_obj
            result.course = course_obj
            result.exam_type = exam_type
            result.semester = semester
            result.total_marks = total_marks
            result.obtained_marks = obtained_marks
            result.result_status = result_status
            result.save()

            return JsonResponse({
                "success": True,
                "message": "Result updated successfully!",
                "redirect": reverse("result_list"),
            })

        except Exception as e:
            return JsonResponse({
                "success": False,
                "message": str(e)
            }, status=400)

    return JsonResponse({
        "success": False,
        "message": "Invalid request method."
    }, status=400)


# ═══════════════════════════════════════════════════════════
#   RESULT DELETE — AJAX
# ═══════════════════════════════════════════════════════════
def result_delete(request, id):
    result = Result.objects.filter(id=id).first()

    if not result:
        return JsonResponse({
            "success": False,
            "message": "Result not found."
        }, status=404)

    result.delete()

    return JsonResponse({
        "success": True,
        "message": "Result deleted successfully.",
        "redirect": reverse("result_list"),
    })