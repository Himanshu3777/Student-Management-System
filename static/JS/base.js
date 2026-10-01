/* ==================================================
   BASE JS — Common JavaScript for ALL apps
   ================================================== */

// ==================================================
// 1. SIDEBAR TOGGLE (for mobile)
// ==================================================

// classList isaka main kam html element ke css ko access and manage karna
// sidebar.classList =>  element ki classes ki list ko access karega.
// toggle('open')->Class hai => remove , class nahi hai => Add kare 
// classList → element ki classes ko access karta hai
// toggle() → class ko add/remove karta hai
// 'open' → jis class ko add/remove karna hai uska naam
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.classList.toggle('open');
  }
}

// ==================================================
// 2. HIGHLIGHT ACTIVE NAV LINK
// ==================================================

// window.location=> ye browser ki current URL ko prved karte hai like http://127.0.0.1:8000/students/

// window.location.pathname => url ke path part deta hai  like -  "/students/"
// const currentPath = window.location.pathname; ->/students/

// includes() check karta hai ki value ke ander like abc value hai
// classList=> element ki cssclasses ki list ko access karte hai
document.addEventListener('DOMContentLoaded', function () {
  const currentPath = window.location.pathname;

  document.querySelectorAll('.nav-link').forEach((link) => {
    const linkPath = link.getAttribute('href');
    if (linkPath && linkPath !== '#' && currentPath.includes(linkPath)) {
      link.classList.add('active');
    }
  });
});

// ==================================================
// 3. CONFIRM DELETE (Reusable)
// ==================================================
function confirmDelete(name = 'this item') {
  return confirm(`Are you sure you want to delete ${name}?`);
}

// ==================================================
// 4. SEARCH / FILTER TABLE
// ==================================================
function filterTable(inputId, tableId) {
  const input = document.getElementById(inputId);
  const table = document.getElementById(tableId);

  if (!input || !table) return;

  const filter = input.value.toLowerCase().trim();
  const rows = table.querySelectorAll('tbody tr');

  let visibleCount = 0;

  rows.forEach((row) => {
    // Skip empty state rows
    if (row.querySelector('.empty-state')) return;

    const text = row.textContent.toLowerCase();
    if (text.includes(filter)) {
      row.style.display = '';
      visibleCount++;
    } else {
      row.style.display = 'none';
    }
  });

  // Show/hide empty state if exists
  const emptyState = table.parentElement.querySelector('.empty-state');
  if (emptyState) {
    emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
  }
}

// ==================================================
// 5. AUTO-CLOSE SIDEBAR ON LINK CLICK (mobile)
// ==================================================
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      const sidebar = document.getElementById('sidebar');
      if (sidebar && window.innerWidth <= 900) {
        sidebar.classList.remove('open');
      }
    });
  });
});

// ==================================================
// 6. SMOOTH SCROLL (Bonus)
// ==================================================
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId !== '#') {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
});

// ==================================================
// 7. PAGE LOADED — Console Message (for debug)
// ==================================================
console.log('%c✅ SMS Base JS Loaded Successfully', 'color: #38a169; font-weight: bold;');