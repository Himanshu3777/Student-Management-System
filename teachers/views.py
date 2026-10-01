from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.urls import reverse
from .models import Teacher


# ═══════════════════════════════════════════════════════════
#   TEACHER LIST — HTML page
# ═══════════════════════════════════════════════════════════
def teacher_list(request):
    return render(request, "teacher_list.html")


# ═══════════════════════════════════════════════════════════
#   TEACHER LIST DATA — JSON (AJAX)
# ═══════════════════════════════════════════════════════════
def teacher_list_data(request):
    teachers = Teacher.objects.all().order_by('-id')

    data = []
    for t in teachers:
        data.append({
            "id": t.id,
            "fname": t.fname,
            "employee_id": t.employee_id,
            "email": t.email,
            "phone": t.phone or "—",
            "subject": t.subject,
            "qualification": t.qualification or "—",
            "experience": t.experience,
            "joining_date": str(t.joining_date) if t.joining_date else "—",
            "address": t.address or "—",
        })

    return JsonResponse({
        "success": True,
        "count": len(data),
        "teachers": data,
    })


# ═══════════════════════════════════════════════════════════
#   TEACHER ADD — GET form + POST save
# ═══════════════════════════════════════════════════════════
def teacher_add(request):
    if request.method == 'GET':
        return render(request, "teacher_add.html")

    if request.method == 'POST':
        try:
            fname = request.POST.get('name')
            employee_id = request.POST.get('employee_id')
            email = request.POST.get("email")
            phone = request.POST.get("phone")
            subject = request.POST.get("subject")
            qualification = request.POST.get('qualification')
            experience = request.POST.get("experience") or 0
            joining_date = request.POST.get("joining_date") or None
            address = request.POST.get('address')

            # Validation
            if not all([fname, employee_id, email, subject]):
                return JsonResponse({
                    "success": False,
                    "message": "Please fill in all required fields."
                }, status=400)

            # Duplicate check
            if Teacher.objects.filter(employee_id=employee_id).exists():
                return JsonResponse({
                    "success": False,
                    "message": "Employee ID already exists."
                }, status=400)

            Teacher.objects.create(
                fname=fname,
                employee_id=employee_id,
                email=email,
                phone=phone,
                subject=subject,
                qualification=qualification,
                experience=experience,
                joining_date=joining_date,
                address=address,
            )

            return JsonResponse({
                "success": True,
                "message": "Teacher added successfully",
                "redirect": reverse("teacher_list"),
            })

        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': str(e)
            }, status=400)

    return JsonResponse({
        "success": False,
        "message": "Invalid request method."
    }, status=400)


# ═══════════════════════════════════════════════════════════
#   TEACHER DETAIL — HTML page
# ═══════════════════════════════════════════════════════════
def teacher_detail(request, id):
    return render(request, "teacher_detail.html", {
        "teacher_id": id,
    })


# ═══════════════════════════════════════════════════════════
#   TEACHER DATA — JSON (AJAX)
# ═══════════════════════════════════════════════════════════
def teacher_data(request, id):
    teacher = Teacher.objects.filter(id=id).first()

    if not teacher:
        return JsonResponse({
            "success": False,
            "message": "Teacher not found."
        }, status=404)

    return JsonResponse({
        "success": True,
        "teacher": {
            "id": teacher.id,
            "fname": teacher.fname,
            "initials": teacher.fname[0].upper() if teacher.fname else "T",
            "employee_id": teacher.employee_id,
            "email": teacher.email,
            "phone": teacher.phone or "—",
            "subject": teacher.subject,
            "qualification": teacher.qualification or "—",
            "experience": teacher.experience,
            "joining_date": str(teacher.joining_date) if teacher.joining_date else "—",
            "address": teacher.address or "—",
        }
    })


# ═══════════════════════════════════════════════════════════
#   TEACHER EDIT — GET form + POST update
# ═══════════════════════════════════════════════════════════
def teacher_edit(request, id):
    teacher = Teacher.objects.filter(id=id).first()

    if not teacher:
        return redirect("teacher_list")

    if request.method == 'GET':
        return render(request, "teacher_edit.html", {
            "teacher": teacher,
        })

    if request.method == 'POST':
        try:
            teacher.fname = request.POST.get('name')
            teacher.employee_id = request.POST.get('employee_id')
            teacher.email = request.POST.get('email')
            teacher.phone = request.POST.get('phone')
            teacher.subject = request.POST.get('subject')
            teacher.qualification = request.POST.get('qualification')
            teacher.experience = request.POST.get('experience') or 0
            teacher.joining_date = request.POST.get('joining_date') or None
            teacher.address = request.POST.get('address')
            teacher.save()

            return JsonResponse({
                "success": True,
                "message": "Teacher updated successfully!",
                "redirect": reverse("teacher_list"),
            })

        except Exception as e:
            return JsonResponse({
                "success": False,
                "message": str(e)
            }, status=400)


# ═══════════════════════════════════════════════════════════
#   TEACHER DELETE — AJAX
# ═══════════════════════════════════════════════════════════
def teacher_delete(request, id):
    teacher = Teacher.objects.filter(id=id).first()

    if not teacher:
        return JsonResponse({
            "success": False,
            "message": "Teacher not found."
        }, status=404)

    teacher.delete()

    return JsonResponse({
        "success": True,
        "message": "Teacher deleted successfully.",
        "redirect": reverse("teacher_list"),
    })