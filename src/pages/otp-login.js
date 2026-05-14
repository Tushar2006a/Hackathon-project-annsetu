// Phone + OTP Login
import { api } from '../data/api.js';

export function renderPhoneLogin() {
  return `
    <div class="page-content" style="padding-top:0;display:flex;flex-direction:column;min-height:100vh;min-height:100dvh;">
      <div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:var(--space-6);">
        <div class="stagger anim-fadeInUp" style="text-align:center;margin-bottom:var(--space-8);">
          <div style="width:72px;height:72px;border-radius:var(--radius-lg);display:flex;align-items:center;justify-content:center;margin:0 auto var(--space-3);overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.2);">
            <img src="/images/logo-icon.svg" alt="Annsetu" style="width:100%;height:100%;object-fit:contain;" />
          </div>
          <h1 style="font-family:var(--font-heading);font-size:var(--fs-2xl);font-weight:var(--fw-bold);margin-bottom:var(--space-1);">Welcome to Annsetu</h1>
          <p style="font-size:var(--fs-sm);color:var(--text-muted);">Enter your phone number to get started</p>
        </div>

        <div id="phone-step">
          <div class="input-group stagger anim-fadeInUp delay-2">
            <label style="font-size:var(--fs-sm);color:var(--text-secondary);margin-bottom:var(--space-2);display:block;">Phone Number</label>
            <div style="display:flex;gap:var(--space-2);">
              <div class="input" style="width:64px;text-align:center;font-weight:var(--fw-semibold);flex-shrink:0;display:flex;align-items:center;justify-content:center;background:var(--bg-secondary);">+91</div>
              <input type="tel" class="input" placeholder="98765 43210" id="phone-input" maxlength="10" style="flex:1;font-size:var(--fs-lg);letter-spacing:1px;" inputmode="numeric" autocomplete="tel" />
            </div>
          </div>
          <div id="phone-error" style="text-align:center;color:var(--error);font-size:var(--fs-sm);margin-top:var(--space-2);display:none;">
            Please enter a valid 10-digit phone number.
          </div>
          <button class="btn btn-primary btn-full btn-lg btn-ripple stagger anim-fadeInUp delay-3" id="send-otp-btn" style="margin-top:var(--space-5);">
            Send OTP
          </button>
          <p class="stagger anim-fadeInUp delay-4" style="text-align:center;margin-top:var(--space-5);font-size:var(--fs-xs);color:var(--text-muted);line-height:var(--lh-relaxed);">
            By continuing, you agree to our<br>
            <span style="color:var(--accent-clay);">Terms of Service</span> & <span style="color:var(--accent-clay);">Privacy Policy</span>
          </p>
        </div>

        <div id="otp-step" style="display:none;">
          <div style="text-align:center;margin-bottom:var(--space-5);">
            <p style="font-size:var(--fs-body);color:var(--text-secondary);">Enter the 4-digit code sent to</p>
            <p style="font-weight:var(--fw-semibold);color:var(--dark);margin-top:var(--space-1);" id="otp-phone-display">+91 98765 43210</p>
          </div>

          <div class="otp-container" id="otp-container">
            <input type="tel" class="otp-input" maxlength="1" inputmode="numeric" data-otp="0" autocomplete="one-time-code" />
            <input type="tel" class="otp-input" maxlength="1" inputmode="numeric" data-otp="1" />
            <input type="tel" class="otp-input" maxlength="1" inputmode="numeric" data-otp="2" />
            <input type="tel" class="otp-input" maxlength="1" inputmode="numeric" data-otp="3" />
          </div>

          <div id="otp-error" style="text-align:center;color:var(--error);font-size:var(--fs-sm);margin-bottom:var(--space-3);display:none;">
            Invalid OTP. Please try again.
          </div>

          <div class="resend-timer" id="resend-timer">
            <span class="resend-timer__link disabled" id="resend-btn">Resend OTP in <span id="resend-countdown">30</span>s</span>
          </div>

          <button class="btn btn-primary btn-full btn-lg btn-ripple" id="verify-otp-btn" style="margin-top:var(--space-5);" disabled>
            <span id="verify-text">Verify</span>
            <div class="dots-loading" id="verify-loader" style="display:none;"><span></span><span></span><span></span></div>
          </button>

          <button class="btn btn-ghost btn-full" id="change-phone-btn" style="margin-top:var(--space-2);font-size:var(--fs-sm);color:var(--text-muted);">
            ← Change number
          </button>
        </div>

        <div id="name-step" style="display:none;">
          <div style="text-align:center;margin-bottom:var(--space-5);">
            <div style="font-size:2rem;margin-bottom:var(--space-2);">👤</div>
            <p style="font-size:var(--fs-body);color:var(--text-secondary);font-weight:var(--fw-semibold);">What's your name?</p>
            <p style="font-size:var(--fs-sm);color:var(--text-muted);margin-top:4px;">This helps us personalize your experience</p>
          </div>
          <div class="input-group">
            <input type="text" class="input" placeholder="Enter your full name" id="user-name-input" autocomplete="name" style="font-size:var(--fs-lg);" />
          </div>
          <button class="btn btn-primary btn-full btn-lg btn-ripple" id="name-continue-btn" style="margin-top:var(--space-5);opacity:0.6;" disabled>
            Continue →
          </button>
        </div>
      </div>
    </div>
  `;
}

export function initPhoneLogin(onVerified) {
  const phoneInput    = document.getElementById('phone-input');
  const sendOtpBtn    = document.getElementById('send-otp-btn');
  const phoneStep     = document.getElementById('phone-step');
  const otpStep       = document.getElementById('otp-step');
  const nameStep      = document.getElementById('name-step');
  const nameInput     = document.getElementById('user-name-input');
  const nameContinue  = document.getElementById('name-continue-btn');
  const otpInputs     = document.querySelectorAll('.otp-input');
  const verifyBtn     = document.getElementById('verify-otp-btn');
  const verifyText    = document.getElementById('verify-text');
  const verifyLoader  = document.getElementById('verify-loader');
  const changePhoneBtn = document.getElementById('change-phone-btn');
  const resendBtn     = document.getElementById('resend-btn');
  const resendCountdown = document.getElementById('resend-countdown');
  const otpError      = document.getElementById('otp-error');
  const phoneError    = document.getElementById('phone-error');

  // Auto-format phone
  phoneInput.addEventListener('input', () => {
    phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, 10);
    const val = phoneInput.value;
    
    // Magic admin bypass
    if (val === '5566') {
      sendOtpBtn.disabled = false;
      phoneError.style.display = 'none';
      sendOtpBtn.style.opacity = '1';
      sendOtpBtn.classList.add('anim-pulseGlow');
      return;
    }

    sendOtpBtn.disabled = val.length < 10;
    phoneError.style.display = 'none';
    if (val.length < 10) {
      sendOtpBtn.style.opacity = '0.6';
    } else {
      sendOtpBtn.style.opacity = '1';
      sendOtpBtn.classList.add('anim-pulseGlow');
    }
  });

  // Send OTP
  sendOtpBtn.addEventListener('click', async () => {
    const phone = phoneInput.value;

    // Magic admin bypass
    if (phone === '5566') {
      const user = { phone: 'admin', role: 'admin', hub: '' };
      localStorage.setItem('annsetu_user', JSON.stringify(user));
      window.location.hash = '#/';
      location.reload();
      return;
    }

    if (phone.length < 10) {
      phoneError.style.display = 'block';
      return;
    }

    sendOtpBtn.disabled = true;
    sendOtpBtn.innerHTML = '<div class="dots-loading"><span></span><span></span><span></span></div>';

    // Call backend
    const result = await api.sendOTP(phone);

    sendOtpBtn.disabled = false;
    sendOtpBtn.innerHTML = 'Send OTP';

    if (!result || !result.success) {
      phoneError.textContent = result?.error || 'Failed to send OTP. Try again.';
      phoneError.style.display = 'block';
      return;
    }

    document.getElementById('otp-phone-display').textContent = `+91 ${phone.slice(0,5)} ${phone.slice(5)}`;

    // Animate transition
    phoneStep.style.animation = 'fadeInLeft 0.3s ease reverse forwards';
    setTimeout(() => {
      phoneStep.style.display = 'none';
      otpStep.style.display = 'block';
      otpStep.style.animation = 'fadeInRight 0.4s var(--ease-out) forwards';
      otpInputs[0].focus();
      startResendTimer();
    }, 300);
  });

  // OTP input magic
  otpInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
      const val = e.target.value.replace(/\D/g, '');
      e.target.value = val.slice(0, 1);

      if (val && index < 3) {
        otpInputs[index + 1].focus();
        input.classList.add('filled');
      }

      // Check if all filled
      const code = [...otpInputs].map(i => i.value).join('');
      verifyBtn.disabled = code.length < 4;
      if (code.length >= 4) {
        verifyBtn.style.opacity = '1';
        verifyBtn.classList.add('anim-pulseGlow');
      } else {
        verifyBtn.style.opacity = '0.6';
        verifyBtn.classList.remove('anim-pulseGlow');
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !e.target.value && index > 0) {
        otpInputs[index - 1].focus();
        otpInputs[index - 1].classList.remove('filled');
      }
    });

    input.addEventListener('focus', () => {
      input.select();
    });

    // Paste support
    input.addEventListener('paste', (e) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
      pasted.split('').forEach((char, i) => {
        if (otpInputs[i]) {
          otpInputs[i].value = char;
          otpInputs[i].classList.add('filled');
        }
      });
      if (pasted.length >= 4) {
        otpInputs[3].focus();
        verifyBtn.disabled = false;
        verifyBtn.style.opacity = '1';
      }
    });
  });

  // Verify OTP
  verifyBtn.addEventListener('click', async () => {
    const code = [...otpInputs].map(i => i.value).join('');
    if (code.length < 4) return;

    // Show loader
    verifyText.style.display = 'none';
    verifyLoader.style.display = 'flex';
    verifyBtn.disabled = true;
    otpError.style.display = 'none';

    // Call backend
    const result = await api.verifyOTP(phoneInput.value, code);

    verifyText.style.display = '';
    verifyLoader.style.display = 'none';

    if (!result || !result.success) {
      otpError.textContent = result?.error || 'Verification failed. Please try again.';
      otpError.style.display = 'block';
      otpInputs.forEach(i => {
        i.style.borderColor = 'var(--error)';
        i.classList.add('error');
      });
      verifyBtn.disabled = false;
      setTimeout(() => {
        otpInputs.forEach(i => {
          i.style.borderColor = '';
          i.classList.remove('error');
        });
      }, 1500);
      return;
    }

    // Save token and user
    if (result.token) {
      localStorage.setItem('annsetu_token', result.token);
    }
    if (result.user) {
      localStorage.setItem('annsetu_userId', result.user.id);
    }

    // Success animation
    otpInputs.forEach(i => {
      i.style.borderColor = 'var(--success)';
      i.style.background = 'var(--success-light)';
    });

    setTimeout(() => {
      // Returning user already has a name → skip name step
      if (result.user?.name) {
        onVerified(phoneInput.value, result);
        return;
      }

      // New user → ask for name first
      otpStep.style.display = 'none';
      nameStep.style.display = 'block';
      nameInput.focus();

      // Enable continue only when name is entered
      nameInput.addEventListener('input', () => {
        const hasName = nameInput.value.trim().length >= 2;
        nameContinue.disabled = !hasName;
        nameContinue.style.opacity = hasName ? '1' : '0.6';
      });

      nameContinue.addEventListener('click', () => {
        const name = nameInput.value.trim();
        if (!name) return;
        // Merge name into result so main.js can persist it
        const enrichedResult = { ...result, user: { ...result.user, name } };
        onVerified(phoneInput.value, enrichedResult);
      });
    }, 600);
  });

  // Change phone
  changePhoneBtn.addEventListener('click', () => {
    otpStep.style.animation = 'fadeInRight 0.3s ease reverse forwards';
    setTimeout(() => {
      otpStep.style.display = 'none';
      phoneStep.style.display = 'block';
      phoneStep.style.animation = 'fadeInLeft 0.4s var(--ease-out) forwards';
      phoneInput.focus();
      otpInputs.forEach(i => { i.value = ''; i.classList.remove('filled'); i.style.borderColor = ''; i.style.background = ''; });
      otpError.style.display = 'none';
    }, 300);
  });

  // Resend timer
  function startResendTimer() {
    let seconds = 30;
    resendCountdown.textContent = seconds;
    resendBtn.classList.add('disabled');
    resendBtn.innerHTML = `Resend OTP in <span id="resend-countdown">${seconds}</span>s`;

    const timer = setInterval(() => {
      seconds--;
      const countdown = document.getElementById('resend-countdown');
      if (countdown) countdown.textContent = seconds;
      if (seconds <= 0) {
        clearInterval(timer);
        resendBtn.classList.remove('disabled');
        resendBtn.innerHTML = 'Resend OTP';
        resendBtn.addEventListener('click', async () => {
          otpInputs.forEach(i => { i.value = ''; i.classList.remove('filled'); });
          otpInputs[0].focus();
          await api.sendOTP(phoneInput.value);
          startResendTimer();
        }, { once: true });
      }
    }, 1000);
  }

  // Focus phone input
  setTimeout(() => phoneInput.focus(), 500);
}
