// Attendance_list  me data ko search karna

// Attendance_list  me data ko search karna

// function filterTable(inputid,tableid){
//  const input=document.getElementById(inputid)
//  const table=document.getElementById(tableid)









/* ============================================================
   ATTENDANCE.JS — Mark Attendance (AJAX)
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  const attendanceForm = document.getElementById('attendanceForm');

  if (!attendanceForm) return;                // Form nahi mila toh ruk jao

  attendanceForm.addEventListener('submit', function (e) {
    e.preventDefault();                       // Page reload roko

    // ─── Validation ───
    const date = document.querySelector('[name="date"]').value;
    const course = document.querySelector('[name="course"]').value;

    if (!date) {
      alert('Please select a date.');
      return;
    }
    if (!course) {
      alert('Please select a course.');
      return;
    }

    // ─── AJAX ───
    const formData = new FormData(attendanceForm);

    fetch("/attendance/mark/", {
      method: "POST",
      headers: {
        "X-CSRFToken": document.querySelector('[name=csrfmiddlewaretoken]').value
      },
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      if (data.success === true) {
        alert(data.message);
        window.location.href = data.redirect;
      } else {
        alert(data.message || 'Failed to mark attendance.');
      }
    })
    .catch(error => {
      console.log('AJAX Error:', error);
      alert('Something went wrong. Please try again.');
    });
  });

});