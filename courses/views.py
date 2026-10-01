from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from .models import Course


# =============== COURSE LIST ===============
def course_list(request):
    courses = Course.objects.all().order_by('id')
    return render(request, "course_list.html", {"courses": courses})


# =============== COURSE DETAIL ===============
def course_detail(request, id):
    course = get_object_or_404(Course, id=id)
    return render(request, "course_details.html", {"course": course})


# =============== COURSE ADD ===============
def course_add(request):
    if request.method == "POST":
        try:
            Course.objects.create(
                courses_name=request.POST.get("name"),
                courses_code=request.POST.get("code"),
                duration=request.POST.get("duration"),                  # 👈 during ya duration
                total_credits=request.POST.get("credits") or 0,
                fee_par_year=request.POST.get("fee") or 0,
                status=request.POST.get("status") or "Active",
                description=request.POST.get("description", ""),
            )
            return JsonResponse({
                "success": True,
                "message": "Course added successfully!",
                "redirect": "/courses/",
            })
        except Exception as e:
            return JsonResponse({
                "success": False,
                "message": str(e),
            })

    return render(request, "course_add.html")


# =============== COURSE EDIT ===============
def course_edit(request, id):
    course = get_object_or_404(Course, id=id)

    if request.method == "POST":
        try:
            course.courses_name = request.POST.get("name")
            course.courses_code = request.POST.get("code")
            course.duration = request.POST.get("duration")              # 👈 during ya duration
            course.total_credits = request.POST.get("credits") or 0
            course.fee_par_year = request.POST.get("fee") or 0
            course.status = request.POST.get("status") or "Active"
            course.description = request.POST.get("description", "")
            course.save()

            return JsonResponse({
                "success": True,
                "message": "Course updated successfully!",
                "redirect": "/courses/",
            })
        except Exception as e:
            return JsonResponse({
                "success": False,
                "message": str(e),
            })

    return render(request, "course_edit.html", {"course": course})


# =============== COURSE DELETE ===============
def course_delete(request, id):
    course = get_object_or_404(Course, id=id)
    course.delete()
    return redirect("course_list")