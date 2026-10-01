/* ============================================================
   STUDENTS.JS — List + Detail + Edit (AJAX)
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ═══════════════════════════════════════════════════════════
     STUDENT LIST — Fetch + Render
     ═══════════════════════════════════════════════════════════ */
  const studentTableBody = document.getElementById('studentTableBody');

  if (studentTableBody) {
    loadStudentList();
  }

  function loadStudentList() {
    fetch("/students/data/")
      .then(res => res.json())
      .then(data => {
        if (data.success === true) {
          renderStudentList(data.students);
        } else {
          console.log('Error:', data.message);
        }
      })
      .catch(error => {
        console.log('AJAX Error:', error);
      });
  }

  function renderStudentList(students) {
    const tbody = document.getElementById('studentTableBody');
    if (!tbody) return;

    if (students.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center; padding:1.5rem; color:#718096;">
            No students found.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = students.map((s, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${s.full_name}</td>
        <td>${s.roll}</td>
        <td>${s.email}</td>
        <td><span class="badge badge-info">${s.course}</span></td>
        <td><span class="badge badge-active">Active</span></td>
        <td>
          <div class="action-btns">
            <a href="/students/detail/${s.id}/" class="icon-btn icon-btn-view" title="View">
              <i class="fas fa-eye"></i>
            </a>
            <a href="/students/edit/${s.id}/" class="icon-btn icon-btn-edit" title="Edit">
              <i class="fas fa-edit"></i>
            </a>
            <button class="icon-btn icon-btn-delete" title="Delete">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }


  /* ═══════════════════════════════════════════════════════════
     STUDENT DETAIL — Fetch by ID
     ═══════════════════════════════════════════════════════════ */
  const studentIdInput = document.getElementById('studentId');

  if (studentIdInput) {
    loadStudentDetail(studentIdInput.value);
  }

  function loadStudentDetail(id) {
    fetch(`/students/data/${id}/`)
      .then(res => res.json())
      .then(data => {
        if (data.success === true) {
          renderStudentDetail(data.student);
        } else {
          alert(data.message || 'Student not found.');
          window.location.href = '/students/';
        }
      })
      .catch(error => {
        console.log('AJAX Error:', error);
      });
  }

  function renderStudentDetail(s) {
    setText('detailInitials', s.initials);
    setText('detailName', s.full_name);
    setText('detailRoll', s.roll);
    setText('detailEmail', s.email);
    setText('detailPhone', s.phone);
    setText('detailCourse', s.course);
    setText('detailGender', s.gender);
    setText('detailDOB', s.DOB);
    setText('detailAddress', s.address);

    const editBtn = document.getElementById('editBtn');
    if (editBtn) editBtn.href = `/students/edit/${s.id}/`;
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value || '—';
  }


  /* ═══════════════════════════════════════════════════════════
     STUDENT FORM — Edit form validation
     ═══════════════════════════════════════════════════════════ */
  const studentForm = document.getElementById('studentForm');

  if (studentForm) {
    studentForm.addEventListener('submit', function (e) {
      const fname = studentForm.querySelector('[name="fname"]')?.value.trim();
      const lname = studentForm.querySelector('[name="lname"]')?.value.trim();
      const roll = studentForm.querySelector('[name="roll_number"]')?.value.trim();
      const email = studentForm.querySelector('[name="email"]')?.value.trim();

      if (!fname || !lname || !roll || !email) {
        alert('Please fill in all required fields.');
        e.preventDefault();
        return;
      }

      if (!email.includes('@') || !email.includes('.')) {
        alert('Please enter a valid email address.');
        e.preventDefault();
      }
    });
  }

});


/* ═══════════════════════════════════════════════════════════
   TABLE SEARCH FILTER
   ═══════════════════════════════════════════════════════════ */
function filterTable(inputId, tableId) {
  const input = document.getElementById(inputId);
  const table = document.getElementById(tableId);

  if (!input || !table) return;

  const filter = input.value.toLowerCase().trim();
  const rows = table.querySelectorAll('tbody tr');

  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(filter) ? '' : 'none';
  });
}


/* ═══════════════════════════════════════════════════════════
   SIDEBAR TOGGLE
   ═══════════════════════════════════════════════════════════ */
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (sidebar) sidebar.classList.toggle("open");
}

document.addEventListener("click", function (e) {
  const sidebar = document.getElementById("sidebar");
  const toggle = document.querySelector(".menu-toggle");

  if (!sidebar || !toggle) return;

  if (window.innerWidth <= 768 && sidebar.classList.contains("open")) {
    if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
      sidebar.classList.remove("open");
    }
  }
});