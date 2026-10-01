/* ============================================================
   RESULTS.JS — List + Detail + Form + Delete (AJAX)
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ═══════════════════════════════════════════════════════════
     RESULT LIST — Fetch + Render
     ═══════════════════════════════════════════════════════════ */
  const resultTableBody = document.getElementById('resultTableBody');

  if (resultTableBody) {
    loadResultList();
  }

  function loadResultList() {
    fetch("/results/data/")
      .then(res => res.json())
      .then(data => {
        if (data.success === true) {
          renderResultList(data.results);
        } else {
          console.log('Error:', data.message);
        }
      })
      .catch(error => {
        console.log('AJAX Error:', error);
      });
  }

  function renderResultList(results) {
    const tbody = document.getElementById('resultTableBody');
    if (!tbody) return;

    if (results.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align:center; padding:1.5rem; color:#718096;">
            No results found.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = results.map((r, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${r.student_name}</td>
        <td>${r.roll}</td>
        <td>${r.course}</td>
        <td>${r.exam_type}</td>
        <td>${r.obtained_marks} / ${r.total_marks}</td>
        <td>
          ${r.result_status === 'Pass'
            ? '<span class="badge badge-active">Pass</span>'
            : '<span class="badge badge-absent">Fail</span>'}
        </td>
        <td>
          <div class="action-btns">
            <a href="/results/detail/${r.id}/" class="icon-btn icon-btn-view" title="View">
              <i class="fas fa-eye"></i>
            </a>
            <a href="/results/edit/${r.id}/" class="icon-btn icon-btn-edit" title="Edit">
              <i class="fas fa-edit"></i>
            </a>
            <button onclick="deleteResultFromList(${r.id})" class="icon-btn icon-btn-delete" title="Delete">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }


  /* ═══════════════════════════════════════════════════════════
     RESULT DETAIL — Fetch by ID
     ═══════════════════════════════════════════════════════════ */
  const resultIdInput = document.getElementById('resultId');

  if (resultIdInput) {
    const resultId = resultIdInput.value;
    loadResultDetail(resultId);
  }

  function loadResultDetail(id) {
    fetch(`/results/data/${id}/`)
      .then(res => res.json())
      .then(data => {
        if (data.success === true) {
          renderResultDetail(data.result);
        } else {
          alert(data.message || 'Result not found.');
          window.location.href = '/results/';
        }
      })
      .catch(error => {
        console.log('AJAX Error:', error);
        alert('Something went wrong.');
      });
  }

  function renderResultDetail(r) {
    setText('detailInitials', r.student_initials);
    setText('detailName', r.student_name);
    setText('detailRoll', r.student_roll);
    setText('detailExam', `${r.exam_type} Exam`);
    setText('detailCourse', r.course);
    setText('detailSemester', `Semester ${r.semester}`);
    setText('detailMarks', `${r.obtained_marks} / ${r.total_marks}`);
    setText('detailPercentage', `${r.percentage}%`);
    setText('detailDate', r.created_at);

    // Status with color
    const statusEl = document.getElementById('detailStatus');
    if (statusEl) {
      if (r.result_status === 'Pass') {
        statusEl.innerHTML = '<span class="status-present">PASS</span>';
      } else {
        statusEl.innerHTML = '<span class="status-absent">FAIL</span>';
      }
    }

    // Edit button URL
    const editBtn = document.getElementById('editBtn');
    if (editBtn) {
      editBtn.href = `/results/edit/${r.id}/`;
    }
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value || '—';
  }


  /* ═══════════════════════════════════════════════════════════
     RESULT FORM — Add / Edit (AJAX)
     ═══════════════════════════════════════════════════════════ */
  const resultForm = document.getElementById('resultForm');

  if (resultForm) {
    resultForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Validation
      const student = document.querySelector('[name="student"]')?.value;
      const course = document.querySelector('[name="course"]')?.value;
      const examType = document.querySelector('[name="exam_type"]')?.value;
      const totalMarks = document.querySelector('[name="total_marks"]')?.value;
      const obtainedMarks = document.querySelector('[name="obtained_marks"]')?.value;

      if (!student || !course || !examType || !totalMarks || !obtainedMarks) {
        return alert('Please fill in all required fields.');
      }

      if (Number(obtainedMarks) > Number(totalMarks)) {
        return alert('Obtained marks cannot be greater than total marks.');
      }

      const formData = new FormData(resultForm);

      fetch(resultForm.action, {
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
          alert(data.message || 'Failed to save result.');
        }
      })
      .catch(error => {
        console.log('AJAX Error:', error);
        alert('Something went wrong. Please try again.');
      });
    });
  }

});


/* ═══════════════════════════════════════════════════════════
   DELETE RESULT FROM LIST (with confirm)
   ═══════════════════════════════════════════════════════════ */
function deleteResultFromList(id) {
  if (!confirm('Delete this result?')) return;

  fetch(`/results/delete/${id}/`, {
    method: "POST",
    headers: {
      "X-CSRFToken": getCSRFToken()
    }
  })
  .then(res => res.json())
  .then(data => {
    if (data.success === true) {
      alert(data.message);
      // Reload list
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
   DELETE RESULT FROM DETAIL PAGE
   ═══════════════════════════════════════════════════════════ */
function deleteResult() {
  const id = document.getElementById('resultId')?.value;
  if (!id) return;

  if (!confirm('Delete this result?')) return;

  fetch(`/results/delete/${id}/`, {
    method: "POST",
    headers: {
      "X-CSRFToken": getCSRFToken()
    }
  })
  .then(res => res.json())
  .then(data => {
    if (data.success === true) {
      alert(data.message);
      window.location.href = data.redirect || '/results/';
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

  // Fallback — cookie se
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
   TABLE SEARCH FILTER (Global — HTML onkeyup ke liye)
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
  if (sidebar) {
    sidebar.classList.toggle("open");
  }
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