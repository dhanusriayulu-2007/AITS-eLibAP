/* eLibAP Auth — localStorage based, no server needed */

const AUTH_KEY = 'elibap_user';

function getUser() {
  try { return JSON.parse(localStorage.getItem(AUTH_KEY)); } catch { return null; }
}

function saveUser(user) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

function logout() {
  localStorage.removeItem(AUTH_KEY);
  renderNav();
}

/* ---------- Modal HTML ---------- */
function injectModal() {
  const modal = document.createElement('div');
  modal.id = 'authModal';
  modal.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:999;align-items:center;justify-content:center;';
  modal.innerHTML = `
    <div style="background:#fff;border-radius:12px;padding:36px;width:100%;max-width:420px;margin:16px;position:relative;box-shadow:0 8px 32px rgba(0,0,0,0.18);">
      <button onclick="closeModal()" style="position:absolute;top:16px;right:16px;background:none;border:none;font-size:22px;cursor:pointer;color:#718096;">✕</button>

      <!-- LOGIN FORM -->
      <div id="loginForm">
        <h2 style="font-size:22px;font-weight:bold;margin-bottom:6px;color:#1a4f50;">Welcome back</h2>
        <p style="color:#718096;font-size:14px;margin-bottom:24px;">Log in to your eLibAP account</p>
        <div id="loginError" style="display:none;background:#fff5f5;border:1px solid #fed7d7;color:#c53030;padding:10px 14px;border-radius:6px;font-size:13px;margin-bottom:16px;"></div>
        <label style="display:block;font-size:13px;font-weight:600;margin-bottom:6px;color:#4a5568;">Email address</label>
        <input id="loginEmail" type="email" placeholder="you@example.com"
          style="width:100%;padding:11px 14px;border:1px solid #e2e8f0;border-radius:7px;font-size:14px;margin-bottom:14px;outline:none;box-sizing:border-box;">
        <label style="display:block;font-size:13px;font-weight:600;margin-bottom:6px;color:#4a5568;">Password</label>
        <input id="loginPassword" type="password" placeholder="Enter your password"
          style="width:100%;padding:11px 14px;border:1px solid #e2e8f0;border-radius:7px;font-size:14px;margin-bottom:20px;outline:none;box-sizing:border-box;">
        <button onclick="doLogin()"
          style="width:100%;padding:12px;background:#2c7a7b;color:#fff;border:none;border-radius:7px;font-size:15px;font-weight:bold;cursor:pointer;">
          Log in
        </button>
        <p style="text-align:center;margin-top:16px;font-size:14px;color:#718096;">
          No account? <a href="#" onclick="showSignup()" style="color:#2c7a7b;font-weight:600;">Sign up free</a>
        </p>
      </div>

      <!-- SIGNUP FORM -->
      <div id="signupForm" style="display:none;">
        <h2 style="font-size:22px;font-weight:bold;margin-bottom:6px;color:#1a4f50;">Create your account</h2>
        <p style="color:#718096;font-size:14px;margin-bottom:24px;">Free access — no subscription fees</p>
        <div id="signupError" style="display:none;background:#fff5f5;border:1px solid #fed7d7;color:#c53030;padding:10px 14px;border-radius:6px;font-size:13px;margin-bottom:16px;"></div>
        <label style="display:block;font-size:13px;font-weight:600;margin-bottom:6px;color:#4a5568;">Full name</label>
        <input id="signupName" type="text" placeholder="Your name"
          style="width:100%;padding:11px 14px;border:1px solid #e2e8f0;border-radius:7px;font-size:14px;margin-bottom:14px;outline:none;box-sizing:border-box;">
        <label style="display:block;font-size:13px;font-weight:600;margin-bottom:6px;color:#4a5568;">Email address</label>
        <input id="signupEmail" type="email" placeholder="you@example.com"
          style="width:100%;padding:11px 14px;border:1px solid #e2e8f0;border-radius:7px;font-size:14px;margin-bottom:14px;outline:none;box-sizing:border-box;">
        <label style="display:block;font-size:13px;font-weight:600;margin-bottom:6px;color:#4a5568;">Password</label>
        <input id="signupPassword" type="password" placeholder="At least 6 characters"
          style="width:100%;padding:11px 14px;border:1px solid #e2e8f0;border-radius:7px;font-size:14px;margin-bottom:20px;outline:none;box-sizing:border-box;">
        <button onclick="doSignup()"
          style="width:100%;padding:12px;background:#2c7a7b;color:#fff;border:none;border-radius:7px;font-size:15px;font-weight:bold;cursor:pointer;">
          Create account
        </button>
        <p style="text-align:center;margin-top:16px;font-size:14px;color:#718096;">
          Already have an account? <a href="#" onclick="showLogin()" style="color:#2c7a7b;font-weight:600;">Log in</a>
        </p>
      </div>

      <!-- SUCCESS VIEW -->
      <div id="successView" style="display:none;text-align:center;">
        <div style="font-size:48px;margin-bottom:12px;">✅</div>
        <h2 style="font-size:20px;font-weight:bold;color:#1a4f50;margin-bottom:8px;" id="successMsg">Welcome!</h2>
        <p style="color:#718096;font-size:14px;margin-bottom:20px;">You are now logged in to eLibAP.</p>
        <button onclick="closeModal()"
          style="padding:10px 28px;background:#2c7a7b;color:#fff;border:none;border-radius:7px;font-size:14px;cursor:pointer;font-weight:bold;">
          Start reading
        </button>
      </div>
    </div>`;
  document.body.appendChild(modal);

  // Close on backdrop click
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  // Enter key submits
  document.getElementById('loginPassword').addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
  document.getElementById('signupPassword').addEventListener('keydown', e => { if (e.key === 'Enter') doSignup(); });
}

/* ---------- Modal Controls ---------- */
function openLogin() {
  showLogin();
  document.getElementById('authModal').style.display = 'flex';
  setTimeout(() => document.getElementById('loginEmail').focus(), 50);
}

function openSignup() {
  showSignup();
  document.getElementById('authModal').style.display = 'flex';
  setTimeout(() => document.getElementById('signupName').focus(), 50);
}

function closeModal() {
  document.getElementById('authModal').style.display = 'none';
  clearErrors();
}

function showLogin() {
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('signupForm').style.display = 'none';
  document.getElementById('successView').style.display = 'none';
  clearErrors();
}

function showSignup() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('signupForm').style.display = 'block';
  document.getElementById('successView').style.display = 'none';
  clearErrors();
}

function clearErrors() {
  ['loginError','signupError'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.style.display = 'none'; el.textContent = ''; }
  });
}

function showError(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.style.display = 'block';
}

/* ---------- Auth Logic (localStorage) ---------- */
function doLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (!email) return showError('loginError', 'Please enter your email address.');
  if (!password) return showError('loginError', 'Please enter your password.');

  // Get all registered users
  const users = JSON.parse(localStorage.getItem('elibap_users') || '[]');
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) return showError('loginError', 'No account found with this email. Please sign up first.');
  if (user.password !== btoa(password)) return showError('loginError', 'Incorrect password. Please try again.');

  saveUser({ name: user.name, email: user.email });
  document.getElementById('successMsg').textContent = `Welcome back, ${user.name.split(' ')[0]}!`;
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('successView').style.display = 'block';
  renderNav();
}

function doSignup() {
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;

  if (!name) return showError('signupError', 'Please enter your full name.');
  if (!email || !email.includes('@')) return showError('signupError', 'Please enter a valid email address.');
  if (password.length < 6) return showError('signupError', 'Password must be at least 6 characters.');

  const users = JSON.parse(localStorage.getItem('elibap_users') || '[]');
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return showError('signupError', 'An account with this email already exists. Please log in.');
  }

  users.push({ name, email, password: btoa(password) });
  localStorage.setItem('elibap_users', JSON.stringify(users));
  saveUser({ name, email });

  document.getElementById('successMsg').textContent = `Welcome to eLibAP, ${name.split(' ')[0]}!`;
  document.getElementById('signupForm').style.display = 'none';
  document.getElementById('successView').style.display = 'block';
  renderNav();
}

/* ---------- Nav Render ---------- */
function renderNav() {
  const user = getUser();
  const navAuth = document.querySelector('.nav-auth');
  if (!navAuth) return;

  if (user) {
    const initials = user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);
    navAuth.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;">
        <div style="width:34px;height:34px;border-radius:50%;background:#2c7a7b;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:13px;">${initials}</div>
        <span style="font-size:14px;font-weight:500;color:#1a4f50;">${user.name.split(' ')[0]}</span>
        <button onclick="logout()" style="padding:6px 14px;border:1px solid #e2e8f0;border-radius:6px;background:none;font-size:13px;cursor:pointer;color:#718096;">Logout</button>
      </div>`;
  } else {
    navAuth.innerHTML = `
      <a href="#" class="btn-ghost" onclick="openLogin();return false;">Login</a>
      <a href="#" class="btn-primary" onclick="openSignup();return false;">Sign up free</a>`;
  }
}

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  injectModal();
  renderNav();
});
