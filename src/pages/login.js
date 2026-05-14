// Mobile Profile / Login Page
import { renderAppHeader, renderBottomNav } from '../components/navbar.js';
import { api } from '../data/api.js';

export function renderLogin() {
  return `
    ${renderAppHeader('Sign In', true)}
    <main class="page-content">
      <div class="px" style="padding-top:var(--space-8);">
        <div style="text-align:center;margin-bottom:var(--space-8);">
          <div style="width:72px;height:72px;border-radius:var(--radius-lg);display:flex;align-items:center;justify-content:center;margin:0 auto var(--space-3);overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.2);">
            <img src="/images/logo-icon.svg" alt="Annsetu" style="width:100%;height:100%;object-fit:cover;" />
          </div>
          <h1 style="font-family:var(--font-heading);font-size:var(--fs-2xl);font-weight:var(--fw-bold);margin-bottom:var(--space-1);">Welcome back</h1>
          <p style="font-size:var(--fs-sm);color:var(--text-muted);">Sign in to your Annsetu account</p>
        </div>

        <form onsubmit="event.preventDefault();" id="login-form">
          <div class="input-group">
            <label>Phone or Email</label>
            <input type="text" class="input" placeholder="+91 98765 43210" id="login-phone" />
          </div>
          <div class="input-group">
            <label>Password</label>
            <input type="password" class="input" placeholder="••••••••" id="login-password" />
          </div>
          <div id="login-error" style="text-align:center;color:var(--error);font-size:var(--fs-sm);margin-bottom:var(--space-3);display:none;"></div>
          <div style="text-align:right;margin-bottom:var(--space-5);">
            <a style="font-size:var(--fs-sm);color:var(--accent-clay);cursor:pointer;">Forgot password?</a>
          </div>
          <button type="submit" class="btn btn-primary btn-full btn-lg" id="login-submit-btn">
            <span id="login-btn-text">Sign In</span>
            <div class="dots-loading" id="login-loader" style="display:none;"><span></span><span></span><span></span></div>
          </button>
        </form>

        <div style="text-align:center;margin-top:var(--space-6);margin-bottom:var(--space-4);">
          <span style="font-size:var(--fs-sm);color:var(--text-muted);">or continue with</span>
        </div>
        <div style="display:flex;gap:var(--space-3);">
          <button class="btn btn-secondary btn-full" id="google-login-btn">📱 Google</button>
          <button class="btn btn-secondary btn-full" id="otp-login-btn">📞 OTP</button>
        </div>

        <p style="text-align:center;margin-top:var(--space-6);font-size:var(--fs-sm);color:var(--text-muted);">
          Don't have an account? <a href="#/register" style="color:var(--accent-clay);font-weight:var(--fw-semibold);">Sign up</a>
        </p>
      </div>
    </main>
  `;
}

export function initLogin() {
  const form = document.getElementById('login-form');
  const phoneInput = document.getElementById('login-phone');
  const btnText = document.getElementById('login-btn-text');
  const loader = document.getElementById('login-loader');
  const submitBtn = document.getElementById('login-submit-btn');
  const errorEl = document.getElementById('login-error');

  // Sign In via phone + password (sends OTP for demo)
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const phone = phoneInput?.value?.replace(/\D/g, '').slice(-10);
    if (!phone || phone.length < 10) {
      errorEl.textContent = 'Please enter a valid phone number';
      errorEl.style.display = 'block';
      return;
    }

    errorEl.style.display = 'none';
    btnText.style.display = 'none';
    loader.style.display = 'flex';
    submitBtn.disabled = true;

    const result = await api.sendOTP(phone);

    btnText.style.display = '';
    loader.style.display = 'none';
    submitBtn.disabled = false;

    if (result?.success) {
      // Navigate to main app (simplified sign-in)
      const user = { phone, role: 'consumer', hub: '' };
      localStorage.setItem('annsetu_user', JSON.stringify(user));
      window.location.hash = '#/';
      location.reload();
    } else {
      errorEl.textContent = result?.error || 'Sign in failed. Try again.';
      errorEl.style.display = 'block';
    }
  });

  // OTP Login button → reload to show onboarding OTP flow
  document.getElementById('otp-login-btn')?.addEventListener('click', () => {
    localStorage.removeItem('annsetu_user');
    location.reload();
  });

  // Google login (demo — just sign in)
  document.getElementById('google-login-btn')?.addEventListener('click', () => {
    const user = { phone: '9876543210', role: 'consumer', hub: '' };
    localStorage.setItem('annsetu_user', JSON.stringify(user));
    window.location.hash = '#/';
    location.reload();
  });
}

export function renderRegister() {
  return `
    ${renderAppHeader('Create Account', true)}
    <main class="page-content">
      <div class="px" style="padding-top:var(--space-6);">
        <h1 style="font-family:var(--font-heading);font-size:var(--fs-2xl);font-weight:var(--fw-bold);margin-bottom:var(--space-1);">Join Annsetu</h1>
        <p style="font-size:var(--fs-sm);color:var(--text-muted);margin-bottom:var(--space-6);">Choose your role to get started</p>

        <!-- Role Selection -->
        <div style="display:flex;flex-direction:column;gap:var(--space-3);margin-bottom:var(--space-6);" id="role-selector">
          <div class="card role-card role-card--active" data-role="consumer" style="display:flex;gap:var(--space-3);align-items:center;cursor:pointer;border:2px solid var(--accent-clay);">
            <div style="font-size:1.5rem;">🛒</div>
            <div>
              <div style="font-weight:var(--fw-semibold);">Consumer</div>
              <div style="font-size:var(--fs-xs);color:var(--text-muted);">Buy fresh produce for your family</div>
            </div>
          </div>
          <div class="card role-card" data-role="farmer" style="display:flex;gap:var(--space-3);align-items:center;cursor:pointer;">
            <div style="font-size:1.5rem;">🌾</div>
            <div>
              <div style="font-weight:var(--fw-semibold);">Farmer</div>
              <div style="font-size:var(--fs-xs);color:var(--text-muted);">Sell your produce directly</div>
            </div>
          </div>
          <div class="card role-card" data-role="hub" style="display:flex;gap:var(--space-3);align-items:center;cursor:pointer;">
            <div style="font-size:1.5rem;">🏪</div>
            <div>
              <div style="font-weight:var(--fw-semibold);">Hub Operator</div>
              <div style="font-size:var(--fs-xs);color:var(--text-muted);">Manage local distribution</div>
            </div>
          </div>
        </div>

        <form onsubmit="event.preventDefault();" id="register-form">
          <div class="input-group">
            <label>Full Name</label>
            <input type="text" class="input" placeholder="Your name" id="reg-name" />
          </div>
          <div class="input-group">
            <label>Phone Number</label>
            <input type="tel" class="input" placeholder="+91 98765 43210" id="reg-phone" />
          </div>
          <div class="input-group">
            <label>Password</label>
            <input type="password" class="input" placeholder="Min 8 characters" id="reg-password" />
          </div>
          <div id="reg-error" style="text-align:center;color:var(--error);font-size:var(--fs-sm);margin-bottom:var(--space-3);display:none;"></div>
          <button type="submit" class="btn btn-primary btn-full btn-lg" style="margin-top:var(--space-2);" id="reg-submit-btn">
            <span id="reg-btn-text">Create Account</span>
            <div class="dots-loading" id="reg-loader" style="display:none;"><span></span><span></span><span></span></div>
          </button>
        </form>

        <p style="text-align:center;margin-top:var(--space-5);font-size:var(--fs-sm);color:var(--text-muted);">
          Already have an account? <a href="#/login" style="color:var(--accent-clay);font-weight:var(--fw-semibold);">Sign in</a>
        </p>
      </div>
    </main>
  `;
}

export function initRegister() {
  const selector = document.getElementById('role-selector');
  let selectedRole = 'consumer';

  if (selector) {
    selector.addEventListener('click', (e) => {
      const card = e.target.closest('.role-card');
      if (!card) return;
      selector.querySelectorAll('.role-card').forEach(c => {
        c.classList.remove('role-card--active');
        c.style.borderColor = 'var(--border-light)';
      });
      card.classList.add('role-card--active');
      card.style.borderColor = 'var(--accent-clay)';
      selectedRole = card.dataset.role;
    });
  }

  const form = document.getElementById('register-form');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name')?.value;
    const phone = document.getElementById('reg-phone')?.value?.replace(/\D/g, '').slice(-10);
    const errorEl = document.getElementById('reg-error');
    const btnText = document.getElementById('reg-btn-text');
    const loader = document.getElementById('reg-loader');
    const submitBtn = document.getElementById('reg-submit-btn');

    if (!name || !phone || phone.length < 10) {
      errorEl.textContent = 'Please fill in all fields with valid data';
      errorEl.style.display = 'block';
      return;
    }

    errorEl.style.display = 'none';
    btnText.style.display = 'none';
    loader.style.display = 'flex';
    submitBtn.disabled = true;

    const result = await api.createUser({ name, phone, role: selectedRole });

    btnText.style.display = '';
    loader.style.display = 'none';
    submitBtn.disabled = false;

    if (result?.success) {
      const user = { phone, role: selectedRole, hub: '' };
      localStorage.setItem('annsetu_user', JSON.stringify(user));
      if (result.user?.id) localStorage.setItem('annsetu_userId', result.user.id);
      window.location.hash = '#/';
      location.reload();
    } else {
      errorEl.textContent = result?.error || 'Registration failed. Try again.';
      errorEl.style.display = 'block';
    }
  });
}
