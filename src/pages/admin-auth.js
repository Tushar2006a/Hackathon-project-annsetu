export function renderAdminLogin() {
  return `
    <div class="admin-auth">
      <div class="admin-auth__panel">
        <div class="admin-auth__header">
          <div class="admin-auth__mark">A</div>
          <div>
            <div class="admin-auth__title">Annsetu Ops Access</div>
            <div class="admin-auth__meta">Secure admin login with OTP, RBAC, and session auditing.</div>
          </div>
        </div>

        <div class="admin-auth__grid">
          <div class="admin-auth__form">
            <div class="admin-form-row">
              <label for="admin-email">Work email or phone</label>
              <input id="admin-email" class="admin-input" type="text" placeholder="ops@annsetu.com" />
            </div>

            <div class="admin-form-row">
              <label for="admin-role">Access role</label>
              <select id="admin-role" class="admin-input">
                <option>Super Admin</option>
                <option>Hub Manager</option>
                <option>Inventory Manager</option>
                <option>Delivery Manager</option>
                <option>Support Executive</option>
              </select>
            </div>

            <div class="admin-form-row admin-form-row--split">
              <div>
                <label for="admin-otp">One-time passcode</label>
                <input id="admin-otp" class="admin-input" type="text" placeholder="Enter OTP" />
              </div>
              <button id="admin-send-otp" class="admin-btn admin-btn--ghost" type="button">Send OTP</button>
            </div>

            <div class="admin-auth__actions">
              <button id="admin-login-btn" class="admin-btn" type="button">Enter control center</button>
              <button id="admin-demo-btn" class="admin-btn admin-btn--ghost" type="button">Use demo access</button>
            </div>

            <div id="admin-otp-status" class="admin-auth__status">OTP delivery and session logs are monitored in real time.</div>
          </div>

          <div class="admin-auth__side">
            <div class="admin-card">
              <div class="admin-card__header">
                <h3>Active admin sessions</h3>
                <span class="admin-tag">5 live</span>
              </div>
              <ul class="admin-list">
                <li>
                  <div>
                    <strong>Rhea Kapoor</strong>
                    <span>Super Admin | Pune Central</span>
                  </div>
                  <span class="admin-tag admin-tag--success">Active</span>
                </li>
                <li>
                  <div>
                    <strong>Kiran Mehta</strong>
                    <span>Inventory Manager | Nashik</span>
                  </div>
                  <span class="admin-tag">Idle 12m</span>
                </li>
                <li>
                  <div>
                    <strong>Akash Rana</strong>
                    <span>Delivery Manager | Mumbai East</span>
                  </div>
                  <span class="admin-tag admin-tag--warning">OTP pending</span>
                </li>
              </ul>
            </div>

            <div class="admin-card">
              <div class="admin-card__header">
                <h3>Latest activity logs</h3>
                <span class="admin-tag">Audit</span>
              </div>
              <ul class="admin-feed">
                <li>
                  <span class="admin-feed__dot"></span>
                  <div>
                    <strong>Pricing rule updated</strong>
                    <span>Near-expiry markdown set to 16%.</span>
                  </div>
                  <span class="admin-time">3m</span>
                </li>
                <li>
                  <span class="admin-feed__dot"></span>
                  <div>
                    <strong>Session approved</strong>
                    <span>Hub Manager access granted for Pune West.</span>
                  </div>
                  <span class="admin-time">9m</span>
                </li>
                <li>
                  <span class="admin-feed__dot"></span>
                  <div>
                    <strong>Failed login attempt</strong>
                    <span>Unknown IP blocked after 3 retries.</span>
                  </div>
                  <span class="admin-time">18m</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initAdminLogin() {
  const app = document.getElementById('app');
  app?.classList.add('admin-app');
  document.body.classList.add('admin-body');

  const storedTheme = localStorage.getItem('annsetu_admin_theme');
  if (storedTheme === 'dark') {
    document.body.dataset.theme = 'dark';
  }

  const emailInput = document.getElementById('admin-email');
  const roleSelect = document.getElementById('admin-role');
  const otpStatus = document.getElementById('admin-otp-status');

  document.getElementById('admin-send-otp')?.addEventListener('click', () => {
    const email = emailInput?.value?.trim() || 'registered contact';
    if (otpStatus) {
      otpStatus.textContent = `OTP sent to ${email}. Expires in 5 minutes.`;
    }
  });

  const createProfile = (roleValue, emailValue) => {
    const safeRole = roleValue || 'Super Admin';
    const email = emailValue?.trim();
    const nameSeed = email ? email.split('@')[0] : 'super.admin';
    const displayName = nameSeed
      .replace(/[^a-zA-Z0-9._-]/g, ' ')
      .replace(/[._-]+/g, ' ')
      .trim()
      .split(' ')
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ') || 'Super Admin';

    return {
      name: displayName,
      role: safeRole,
      hub: 'Pune Central Hub',
      email: email || 'ops@annsetu.com'
    };
  };

  const completeLogin = (profile) => {
    localStorage.setItem('annsetu_user', JSON.stringify({ role: 'admin' }));
    localStorage.setItem('annsetu_admin_profile', JSON.stringify(profile));
    window.location.hash = '#/';
    location.reload();
  };

  document.getElementById('admin-login-btn')?.addEventListener('click', () => {
    const profile = createProfile(roleSelect?.value, emailInput?.value);
    completeLogin(profile);
  });

  document.getElementById('admin-demo-btn')?.addEventListener('click', () => {
    const profile = {
      name: 'Demo Admin',
      role: 'Super Admin',
      hub: 'Pune Central Hub',
      email: 'demo@annsetu.com'
    };
    completeLogin(profile);
  });
}
