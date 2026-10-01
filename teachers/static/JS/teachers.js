/* ============================================================
   TEACHERS.JS — List + Detail + Form + Delete (AJAX)
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ═══════════════════════════════════════════════════════════
     TEACHER LIST — Fetch + Render
     ═══════════════════════════════════════════════════════════ */
  const teacherTableBody = document.getElementById('teacherTableBody');

  if (teacherTableBody) {
    loadTeacherList();
  }

  function loadTeacherList() {
    fetch("/teachers/data/")
      .then(res => res.json())
      .then(data => {
        if (data.success === true) {
          renderTeacherList(data.teachers);
        } else {
          console.log('Error:', data.message);
        }
      })
      .catch(error => {
        console.log('AJAX Error:', error);
      });
  }

  function renderTeacherList(teachers) {
    const tbody = document.getElementById('teacherTableBody');
    if (!tbody) return;

    if (teachers.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center; padding:1.5rem; color:#718096;">
            No teachers found.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = teachers.map((t, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${t.fname}</td>
        <td>${t.employee_id}</td>
        <td>${t.email}</td>
        <td><span class="badge badge-info">${t.subject}</span></td>
        <td>${t.phone}</td>
        <td>
          <div class="action-btns">
            <a href="/teachers/detail/${t.id}/" class="icon-btn icon-btn-view" title="View">
              <i class="fas fa-eye"></i>
            </a>
            <a href="/teachers/edit/${t.id}/" class="icon-btn icon-btn-edit" title="Edit">
              <i class="fas fa-edit"></i>
            </a>
            <button onclick="deleteTeacherFromList(${t.id})" class="icon-btn icon-btn-delete" title="Delete">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }


  /* ═══════════════════════════════════════════════════════════
     TEACHER DETAIL — Fetch by ID
     ═══════════════════════════════════════════════════════════ */
  const teacherIdInput = document.getElementById('teacherId');

  if (teacherIdInput) {
    loadTeacherDetail(teacherIdInput.value);
  }

  function loadTeacherDetail(id) {
    fetch(`/teachers/data/${id}/`)
      .then(res => res.json())
      .then(data => {
        if (data.success === true) {
          renderTeacherDetail(data.teacher);
        } else {
          alert(data.message || 'Teacher not found.');
          window.location.href = '/teachers/';
        }
      })
      .catch(error => {
        console.log('AJAX Error:', error);
      });
  }

  function renderTeacherDetail(t) {
    setText('detailInitials', t.initials);
    setText('detailName', t.fname);
    setText('detailEmail', t.email);
    setText('detailSubject', t.subject);
    setText('detailEmpId', t.employee_id);
    setText('detailPhone', t.phone);
    setText('detailQualification', t.qualification);
    setText('detailExperience', `${t.experience} Years`);
    setText('detailAddress', t.address);
    setText('detailJoiningDate', t.joining_date);

    const editBtn = document.getElementById('editBtn');
    if (editBtn) editBtn.href = `/teachers/edit/${t.id}/`;
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value || '—';
  }


  /* ═══════════════════════════════════════════════════════════
     TEACHER FORM — Add / Edit (AJAX)
     ═══════════════════════════════════════════════════════════ */
  const teacherForm = document.getElementById('teacherForm');

  if (teacherForm) {
    teacherForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = teacherForm.querySelector('[name="name"]')?.value.trim();
      const empId = teacherForm.querySelector('[name="employee_id"]')?.value.trim();
      const email = teacherForm.querySelector('[name="email"]')?.value.trim();
      const subject = teacherForm.querySelector('[name="subject"]')?.value.trim();

      if (!name || !empId || !email || !subject) {
        return alert('Please fill in all required fields.');
      }

      if (!email.includes('@') || !email.includes('.')) {
        return alert('Please enter a valid email address.');
      }

      const formData = new FormData(teacherForm);

      fetch(teacherForm.action, {
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
          alert(data.message || 'Failed to save teacher.');
        }
      })
      .catch(error => {
        console.log('AJAX Error:', error);
        alert('Something went wrong.');
      });
    });
  }

});


/* ═══════════════════════════════════════════════════════════
   DELETE TEACHER FROM LIST
   ═══════════════════════════════════════════════════════════ */
function deleteTeacherFromList(id) {
  if (!confirm('Delete this teacher?')) return;

  fetch(`/teachers/delete/${id}/`, {
    method: "POST",
    headers: {
      "X-CSRFToken": getCSRFToken()
    }
  })
  .then(res => res.json())
  .then(data => {
    if (data.success === true) {
      alert(data.message);
      location.reload();
    } else {
      alert(data.message || 'Failed to delete.');
    }
  })
  .catch(error => {
    console.log('AJAX Error:', error);
    alert('Something went wrong.');
  });
}


/* ═══════════════════════════════════════════════════════════
   DELETE TEACHER FROM DETAIL
   ═══════════════════════════════════════════════════════════ */
function deleteTeacher() {
  const id = document.getElementById('teacherId')?.value;
  if (!id) return;

  if (!confirm('Delete this teacher?')) return;

  fetch(`/teachers/delete/${id}/`, {
    method: "POST",
    headers: {
      "X-CSRFToken": getCSRFToken()
    }
  })
  .then(res => res.json())
  .then(data => {
    if (data.success === true) {
      alert(data.message);
      window.location.href = data.redirect || '/teachers/';
    } else {
      alert(data.message || 'Failed to delete.');
    }
  })
  .catch(error => {
    console.log('AJAX Error:', error);
    alert('Something went wrong.');
  });
}


/* ═══════════════════════════════════════════════════════════
   HELPER — CSRF Token
   ═══════════════════════════════════════════════════════════ */
function getCSRFToken() {
  const el = document.querySelector('[name=csrfmiddlewaretoken]');
  if (el) return el.value;

  const name = 'csrftoken';
  const cookies = document.cookie.split(';');
  for (let c of cookies) {
    c = c.trim();
    if (c.startsWith(name + '=')) {
      return c.substring(name.length + 1);
    }
  }
  return '';
}


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