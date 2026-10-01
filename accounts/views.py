from django.shortcuts import render,redirect
from django.http import JsonResponse
from .models import Registration
from courses.models import Course
# reverse ka use url ko pic kar usaka actual path dena
from django.urls import reverse
import json
from django.core.serializers.json import DjangoJSONEncoder


# Create your views here.

# =================LOG LOGICAL CODE==========================
def login(request):
    if request.method == 'POST':
        email = request.POST.get('email', '').strip().lower()
        password = request.POST.get('password', '')
        
        # Empty check
        if not email or not password:
            return JsonResponse({
                "success": False,
                "message": "Email and password are required."
            })
        
        # User dhundho (safe)
        user = Registration.objects.filter(email=email, password=password).first()
        
        if not user:
            return JsonResponse({
                "success": False,
                "message": "Invalid email or password."
            })
        
        # Session 
        # user = Registration.objects.filter(email=email, password=password).first() is user ka id ko session use kar raha hai

# request.session['user_id'] = user.id => session ko sutomaic create karta hai and apane ander user_id key  ko sture karta hai and us key me session ki value karahata hai 
# and user_id isame Registration.objects.filter(email=email, password=password).first() ki id pas hua hai help of this line  user.id like this
# {'user_id': user.id} => {'user_id': 5}

        request.session['user_id'] = user.id
        
        return JsonResponse({
            "success": True,
            "message": "Login successful",
            # reverse profile ka direct path create kar ke deta hai
            "redirect": reverse('profile')
        })
    
    return render(request, "login.html")


# =================END  LOG LOGICAL CODE==========================


# =================REGISTER LOGICAL CODE==========================
def register(request):
    if request.method == "GET":
        course = Course.objects.all()
        return render(request, 'register.html', {"course": course})
    
    if request.method == 'POST':
        try:
            # Form data nikalo
            # strip() method dono side ke  space ko remove kar deta hai 
            # lower() ye upper case ke word ko lower case me convert karta hai

            fname = request.POST.get('first_name', '').strip()
            lname = request.POST.get('last_name', '').strip()
            username = request.POST.get('username', '').strip()
            email = request.POST.get('email', '').strip().lower()
            password = request.POST.get('password', '')
            phone = request.POST.get('phone', '').strip()
            roll = request.POST.get('roll_number', '').strip()
            course_id = request.POST.get('course')
            gender = request.POST.get('gender', '')
            DOB = request.POST.get('date_of_birth')
            address = request.POST.get('address', '').strip()
            
            # Validation
            if not all([fname, lname, username, email, password, phone, roll, course_id]):
                return JsonResponse({
                    "success": False,
                    "message": "Please fill in all required fields."
                }, status=400)
            
            # Duplicate check
            # exists() yah batata ki koi data pahale se email me persent hai kia nahi
            if Registration.objects.filter(email=email).exists():
                return JsonResponse({
                    "success": False,
                    "message": "This email is already registered."
                }, status=400)
            
            # Course dhundho
            course = Course.objects.filter(id=course_id).first()
            # jab course na mile to te error generate  kar deta hai
            if not course:
                return JsonResponse({
                    "success": False,
                    "message": f'Course ID "{course_id}" not found.'
                }, status=400)
            
            # Student create karo
            student_obj = Registration.objects.create(
                fname=fname,
                lname=lname,
                username=username,
                email=email,
                password=password,                                   
                phone=phone,
                roll=roll,
                course=course,
                gender=gender,
                DOB=DOB,
                address=address,
            )
            
            student = {
                "fname": fname,
                "lname": lname,
                "username": username,
                "email": email,
                "phone": phone,
                "roll": roll,
                "course": course.courses_name,
                "gender": gender,
                "dob": DOB,
                "address": address,
            }
            
            return JsonResponse({
                "success": True,
                "message": "Registration successful",
                # yah profile ka direct path deta hai
                "redirect": reverse('profile'),
                "student": student,
            })
        
        except Exception as e:
            return JsonResponse({
                "success": False,
                "message": f"Something went wrong: {str(e)}",
            }, status=400)


        
# =================END  REGISTRACTION LOGICAL CODE==========================

# ========================PROFILE LOGICAL CODE====================

def profile(request):
    user_id = request.session.get('user_id')
    
    if not user_id:
        return redirect("login")
    
    user = Registration.objects.filter(id=user_id).first()
    
    if not user:
        return redirect("login")
    
    return render(request, "profile.html", {
        "registrations": user,
    })







def logout(request):
    # session ko clear/invalidate kar deta hai
    request.session.flush()
    return render(request,"logout.html")
