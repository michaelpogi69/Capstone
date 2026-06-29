document.addEventListener('DOMContentLoaded', function() {
  const header = document.getElementById('mainHeader') || document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 50) header.classList.add('scrolled'); else header.classList.remove('scrolled');
    });
  }

  // Create profile modal styles
  if (!document.getElementById('profileModalStyles')) {
    const style = document.createElement('style');
    style.id = 'profileModalStyles';
    style.textContent = `
      .profile-modal-overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 9999;
        align-items: center;
        justify-content: center;
      }

      .profile-modal-overlay.active {
        display: flex;
      }

      .profile-modal-content {
        background: white;
        border-radius: 16px;
        width: 90%;
        max-width: 500px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        overflow: hidden;
        animation: slideUp 0.3s ease-out;
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .profile-header {
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        padding: 32px 24px;
        text-align: center;
        color: white;
      }

      .profile-header.admin {
        background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
      }

      .profile-avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 16px;
        font-size: 36px;
        border: 3px solid white;
      }

      .profile-avatar img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
      }

      .profile-name {
        font-size: 24px;
        font-weight: 700;
        margin: 0 0 8px;
      }

      .profile-role {
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 1px;
        opacity: 0.9;
        font-weight: 600;
        display: inline-block;
        background: rgba(255, 255, 255, 0.2);
        padding: 4px 12px;
        border-radius: 999px;
        margin-top: 8px;
      }

      .profile-body {
        padding: 24px;
      }

      .profile-section {
        margin-bottom: 24px;
      }

      .profile-section:last-child {
        margin-bottom: 0;
      }

      .profile-section-title {
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        color: #6b7280;
        margin-bottom: 12px;
        letter-spacing: 0.5px;
      }

      .profile-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        background: #f9fafb;
        border-radius: 8px;
        margin-bottom: 8px;
        font-size: 14px;
      }

      .profile-item-label {
        color: #6b7280;
        font-weight: 500;
      }

      .profile-item-value {
        color: #1a1a1a;
        font-weight: 600;
      }

      .profile-stat {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-bottom: 12px;
      }

      .profile-stat-card {
        background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
        padding: 16px;
        border-radius: 10px;
        text-align: center;
        border-left: 4px solid #2563eb;
      }

      .profile-stat-card.admin {
        border-left-color: #dc2626;
      }

      .profile-stat-value {
        font-size: 24px;
        font-weight: 800;
        color: #1a1a1a;
        margin-bottom: 4px;
      }

      .profile-stat-label {
        font-size: 12px;
        color: #6b7280;
        font-weight: 600;
        text-transform: uppercase;
      }

      .profile-actions {
        display: flex;
        gap: 12px;
        margin-top: 24px;
        padding-top: 24px;
        border-top: 1px solid #e5e7eb;
      }

      .profile-btn {
        flex: 1;
        padding: 12px 16px;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }

      .profile-btn-primary {
        background: #2563eb;
        color: white;
      }

      .profile-btn-primary:hover {
        background: #1d4ed8;
        transform: translateY(-1px);
      }

      .profile-btn-primary.admin {
        background: #dc2626;
      }

      .profile-btn-primary.admin:hover {
        background: #991b1b;
      }

      .profile-btn-secondary {
        background: #f3f4f6;
        color: #1a1a1a;
        border: 1px solid #e5e7eb;
      }

      .profile-btn-secondary:hover {
        background: #e5e7eb;
      }

      .profile-btn-danger {
        background: #fee2e2;
        color: #991b1b;
      }

      .profile-btn-danger:hover {
        background: #fecaca;
      }
    `;
    document.head.appendChild(style);
  }

  // Create profile modal
  let profileModal = document.getElementById('profileModal');
  if (!profileModal) {
    profileModal = document.createElement('div');
    profileModal.id = 'profileModal';
    profileModal.className = 'profile-modal-overlay';
    document.body.appendChild(profileModal);
  }

  function renderUserProfile() {
    const userEmail = localStorage.getItem('userEmail') || 'User';
    const userName = localStorage.getItem('baguioTrackUserName') || 'Guest User';
    const userImage = localStorage.getItem('baguioTrackProfileImage');
    const registeredUsers = localStorage.getItem('registeredUsers') || '0';
    const createdDate = localStorage.getItem('userCreatedDate') || new Date().toLocaleDateString();

    profileModal.innerHTML = `
      <div class="profile-modal-content">
        <div class="profile-header">
          <div class="profile-avatar">
            ${userImage ? `<img src="${userImage}" alt="${userName}">` : '<i class="fas fa-user" style="color: white;"></i>'}
          </div>
          <div class="profile-name">${userName}</div>
          <div style="font-size: 13px; margin-top: 4px;">${userEmail}</div>
          <div class="profile-role">👤 Tourist</div>
        </div>
        <div class="profile-body">
          <div class="profile-section">
            <div class="profile-section-title">Account Information</div>
            <div class="profile-item">
              <span class="profile-item-label">Email</span>
              <span class="profile-item-value">${userEmail}</span>
            </div>
            <div class="profile-item">
              <span class="profile-item-label">Member Since</span>
              <span class="profile-item-value">${createdDate}</span>
            </div>
          </div>

          <div class="profile-section">
            <div class="profile-section-title">Activity</div>
            <div class="profile-stat">
              <div class="profile-stat-card">
                <div class="profile-stat-value">${localStorage.getItem('userVisits') || '0'}</div>
                <div class="profile-stat-label">Site Visits</div>
              </div>
              <div class="profile-stat-card">
                <div class="profile-stat-value">${localStorage.getItem('userFeedback') || '0'}</div>
                <div class="profile-stat-label">Feedback Sent</div>
              </div>
            </div>
          </div>

          <div class="profile-actions">
            <button class="profile-btn profile-btn-secondary" onclick="document.getElementById('profileModal').classList.remove('active')">Close</button>
            <button class="profile-btn profile-btn-primary" onclick="window.location.href='home.html'; document.getElementById('profileModal').classList.remove('active');">Go Home</button>
            <button class="profile-btn profile-btn-danger" id="logoutBtnUser">Logout</button>
          </div>
        </div>
      </div>
    `;
  }

  function renderAdminProfile() {
    const adminEmail = localStorage.getItem('adminEmail') || 'Admin';
    const announcements = JSON.parse(localStorage.getItem('announcements') || '[]').length;
    const adminCreatedDate = localStorage.getItem('adminLoginDate') || new Date().toLocaleDateString();

    profileModal.innerHTML = `
      <div class="profile-modal-content">
        <div class="profile-header admin">
          <div class="profile-avatar">
            <i class="fas fa-crown" style="color: white;"></i>
          </div>
          <div class="profile-name">Admin Portal</div>
          <div style="font-size: 13px; margin-top: 4px;">${adminEmail}</div>
          <div class="profile-role">👑 Administrator</div>
        </div>
        <div class="profile-body">
          <div class="profile-section">
            <div class="profile-section-title">Admin Account</div>
            <div class="profile-item">
              <span class="profile-item-label">Email</span>
              <span class="profile-item-value">${adminEmail}</span>
            </div>
            <div class="profile-item">
              <span class="profile-item-label">Last Login</span>
              <span class="profile-item-value">${adminCreatedDate}</span>
            </div>
          </div>

          <div class="profile-section">
            <div class="profile-section-title">Dashboard Stats</div>
            <div class="profile-stat">
              <div class="profile-stat-card admin">
                <div class="profile-stat-value">${announcements}</div>
                <div class="profile-stat-label">Announcements</div>
              </div>
              <div class="profile-stat-card admin">
                <div class="profile-stat-value">${localStorage.getItem('totalFeedback') || '0'}</div>
                <div class="profile-stat-label">Feedback</div>
              </div>
            </div>
          </div>

          <div class="profile-actions">
            <button class="profile-btn profile-btn-secondary" onclick="document.getElementById('profileModal').classList.remove('active')">Close</button>
            <button class="profile-btn profile-btn-primary admin" onclick="window.location.href='admin.html'"><i class="fas fa-cog"></i> Admin Panel</button>
            <button class="profile-btn profile-btn-danger" id="logoutBtnAdmin">Logout</button>
          </div>
        </div>
      </div>
    `;
  }

  const profileBtn = document.getElementById('profileBtn');
  if (profileBtn) {
    profileBtn.addEventListener('click', () => {
      if (localStorage.getItem('isAdminLoggedIn') === 'true') {
        renderAdminProfile();
      } else if (localStorage.getItem('isLoggedIn') === 'true') {
        renderUserProfile();
      }
      profileModal.classList.add('active');
    });
  }

  // Close modal when clicking outside
  profileModal.addEventListener('click', (e) => {
    if (e.target === profileModal) {
      profileModal.classList.remove('active');
    }
  });

  // Logout handlers
  document.addEventListener('click', (e) => {
    if (e.target.id === 'logoutBtnUser') {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userEmail');
      window.location.href = 'index.html';
    } else if (e.target.id === 'logoutBtnAdmin') {
      localStorage.removeItem('isAdminLoggedIn');
      localStorage.removeItem('adminEmail');
      localStorage.removeItem('adminToken');
      window.location.href = 'adminlogin.html';
    }
  });
});