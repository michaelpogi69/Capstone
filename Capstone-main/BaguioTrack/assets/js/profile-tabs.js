(function () {
  const profileArea = document.querySelector('.logo-area');
  if (!profileArea) return;

  const userNameHeading = profileArea.querySelector('h2');
  const profileImage = profileArea.querySelector('img');

  if (!userNameHeading || !profileImage) return;

  const existingDropdown = profileArea.querySelector('.profile-dropdown');
  const dropdown = existingDropdown || document.createElement('div');
  dropdown.className = 'profile-dropdown';
  dropdown.innerHTML = `
    <ul>
      <li><a href="#" id="editProfile">✏️ Edit Profile</a></li>
      <li><a href="#" id="logoutBtn">🚪 Logout</a></li>
    </ul>
  `;

  if (!existingDropdown) {
    profileArea.appendChild(dropdown);
  }

  if (!document.getElementById('profileEnhancementStyles')) {
    const style = document.createElement('style');
    style.id = 'profileEnhancementStyles';
    style.textContent = `
      .logo-area { position: relative; cursor: pointer; }
      .profile-modal {
        display: none;
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.45);
        z-index: 5000;
        align-items: center;
        justify-content: center;
      }
      .profile-modal.active { display: flex; }
      .profile-modal-content {
        background: #fff;
        width: 92%;
        max-width: 420px;
        border-radius: 12px;
        padding: 18px;
      }
      .profile-modal-content h3 { margin: 0 0 12px; color: #145532; }
      .profile-modal-content label { display: block; margin-top: 10px; font-weight: 600; }
      .profile-modal-content input {
        width: 100%;
        padding: 10px;
        margin-top: 6px;
        border: 1px solid #ccc;
        border-radius: 8px;
      }
      .profile-modal-actions {
        margin-top: 14px;
        display: flex;
        gap: 8px;
        justify-content: flex-end;
      }
      .profile-modal-actions button {
        border: none;
        border-radius: 8px;
        padding: 10px 14px;
        cursor: pointer;
        font-weight: 600;
      }
      .profile-cancel-btn { background: #ececec; color: #333; }
      .profile-save-btn { background: #145532; color: #fff; }
    `;
    document.head.appendChild(style);
  }

  let modal = document.getElementById('profileEditModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'profileEditModal';
    modal.className = 'profile-modal';
    modal.innerHTML = `
      <div class="profile-modal-content" role="dialog" aria-modal="true" aria-labelledby="profileModalTitle">
        <h3 id="profileModalTitle">Edit Profile</h3>
        <label for="profileNameInput">Display Name</label>
        <input type="text" id="profileNameInput" maxlength="50" placeholder="Enter your display name" />
        <label for="profileImageInput">Profile Photo</label>
        <input type="file" id="profileImageInput" accept="image/*" />
        <div class="profile-modal-actions">
          <button type="button" class="profile-cancel-btn" id="cancelProfileBtn">Cancel</button>
          <button type="button" class="profile-save-btn" id="saveProfileBtn">Save</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const storedName = localStorage.getItem('baguioTrackUserName');
  const storedImage = localStorage.getItem('baguioTrackProfileImage');
  if (storedName) userNameHeading.textContent = storedName;
  if (storedImage) profileImage.src = storedImage;

  profileArea.addEventListener('click', function (event) {
    event.stopPropagation();
    dropdown.classList.toggle('active');
  });

  document.addEventListener('click', function () {
    dropdown.classList.remove('active');
  });

  dropdown.querySelector('#editProfile').addEventListener('click', function (event) {
    event.preventDefault();
    event.stopPropagation();
    document.getElementById('profileNameInput').value = localStorage.getItem('baguioTrackUserName') || '';
    modal.classList.add('active');
    dropdown.classList.remove('active');
  });

  dropdown.querySelector('#logoutBtn').addEventListener('click', function (event) {
    event.preventDefault();
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'signup.html';
  });

  modal.addEventListener('click', function (event) {
    if (event.target === modal) modal.classList.remove('active');
  });

  document.getElementById('cancelProfileBtn').addEventListener('click', function () {
    modal.classList.remove('active');
  });

  document.getElementById('saveProfileBtn').addEventListener('click', function () {
    const nameValue = document.getElementById('profileNameInput').value.trim();
    const fileInput = document.getElementById('profileImageInput');

    if (nameValue) {
      localStorage.setItem('baguioTrackUserName', nameValue);
      userNameHeading.textContent = nameValue;
    }

    const file = fileInput.files && fileInput.files[0];
    if (!file) {
      modal.classList.remove('active');
      return;
    }

    const reader = new FileReader();
    reader.onload = function () {
      const result = typeof reader.result === 'string' ? reader.result : '';
      if (result) {
        localStorage.setItem('baguioTrackProfileImage', result);
        profileImage.src = result;
      }
      modal.classList.remove('active');
      fileInput.value = '';
    };
    reader.readAsDataURL(file);
  });
})();
