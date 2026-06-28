document.addEventListener('DOMContentLoaded', function() {
  const header = document.getElementById('mainHeader') || document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 50) header.classList.add('scrolled'); else header.classList.remove('scrolled');
    });
  }

  const profileBtn = document.getElementById('profileBtn');
  if (profileBtn) {
    if (localStorage.getItem('isAdminLoggedIn') === 'true') {
      profileBtn.textContent = 'Logout';
      profileBtn.style.background = '#dc2626';
    }
    profileBtn.addEventListener('click', () => {
      if (localStorage.getItem('isAdminLoggedIn') === 'true') {
        localStorage.removeItem('isAdminLoggedIn');
        localStorage.removeItem('adminEmail');
        localStorage.removeItem('adminToken');
        window.location.href = 'home.html';
      } else {
        window.location.href = 'adminlogin.html';
      }
    });
  }
});