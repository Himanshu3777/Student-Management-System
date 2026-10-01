/* ============================================
   TABLE FILTER (Search)
   ============================================ */
function filterTable(inputId, tableId) {
  const input = document.getElementById(inputId);
  const table = document.getElementById(tableId);

  if (!input || !table) return;

  const filter = input.value.toLowerCase();
  const rows = table.querySelectorAll("tbody tr");

  rows.forEach(function (row) {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(filter) ? "" : "none";
  });
}


/* ============================================
   COURSE FORM — AJAX (Add + Edit)
   ============================================ */
document.addEventListener("DOMContentLoaded", function () {
  const courseForm = document.getElementById("courseForm");

  if (!courseForm) return;

  courseForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Validation
    const name = courseForm.querySelector('[name="name"]').value.trim();
    const code = courseForm.querySelector('[name="code"]').value.trim();

    if (!name || !code) {
      alert("Course name and code are required.");
      return;
    }

    const formData = new FormData(courseForm);

    const csrfInput = courseForm.querySelector("[name=csrfmiddlewaretoken]");
    
    const actionUrl = courseForm.getAttribute("action");

    fetch(actionUrl, {
      method: "POST",
      headers: {
        "X-CSRFToken": csrfInput.value,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success === true) {
          alert(data.message);
          window.location.href = data.redirect;
        } else {
          alert(data.message || "Something went wrong.");
        }
      })
      .catch((error) => {
        console.error("AJAX Error:", error);
        alert("Something went wrong. Please try again.");
      });
  });
});