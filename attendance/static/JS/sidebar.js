/* ============================================
   SIDEBAR TOGGLE
   ============================================ */
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (sidebar) {
    sidebar.classList.toggle("open");
  }
}

/* Close sidebar when clicking outside (mobile) */
document.addEventListener("click", function (e) {
  const sidebar = document.getElementById("sidebar");
  const toggle = document.querySelector(".menu-toggle");

  if (!sidebar || !toggle) return;

  // Agar mobile view hai aur sidebar open hai
  if (window.innerWidth <= 768 && sidebar.classList.contains("open")) {
    // Agar click sidebar ke bahar aur toggle ke bahar hua
    if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
      sidebar.classList.remove("open");
    }
  }
});