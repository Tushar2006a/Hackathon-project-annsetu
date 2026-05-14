// Role Selection
export function renderRoleSelect() {
  return `
    <div class="page-content" style="padding-top:0;display:flex;flex-direction:column;min-height:100vh;min-height:100dvh;">
      <div style="flex:1;padding:var(--space-6);display:flex;flex-direction:column;justify-content:center;">
        <div style="text-align:center;margin-bottom:var(--space-8);">
          <h1 style="font-family:var(--font-heading);font-size:var(--fs-2xl);font-weight:var(--fw-bold);margin-bottom:var(--space-2);">Who are you?</h1>
          <p style="font-size:var(--fs-body);color:var(--text-muted);">Choose your role to personalize your experience</p>
        </div>

        <div class="role-cards" id="role-cards">
          <div class="role-card" data-role="consumer">
            <div class="role-card__icon" style="background:var(--cta-amber-light);">🛒</div>
            <div style="flex:1;">
              <div style="font-family:var(--font-heading);font-weight:var(--fw-semibold);font-size:var(--fs-md);">Consumer</div>
              <div style="font-size:var(--fs-xs);color:var(--text-muted);margin-top:2px;">Buy fresh produce for your family</div>
            </div>
            <div class="role-card__check">✓</div>
          </div>

          <div class="role-card" data-role="farmer">
            <div class="role-card__icon" style="background:var(--accent-olive-light);">🌾</div>
            <div style="flex:1;">
              <div style="font-family:var(--font-heading);font-weight:var(--fw-semibold);font-size:var(--fs-md);">Farmer</div>
              <div style="font-size:var(--fs-xs);color:var(--text-muted);margin-top:2px;">Sell your harvest directly to families</div>
            </div>
            <div class="role-card__check">✓</div>
          </div>

          <div class="role-card" data-role="hub">
            <div class="role-card__icon" style="background:var(--accent-clay-light);">🏪</div>
            <div style="flex:1;">
              <div style="font-family:var(--font-heading);font-weight:var(--fw-semibold);font-size:var(--fs-md);">Hub Owner</div>
              <div style="font-size:var(--fs-xs);color:var(--text-muted);margin-top:2px;">Create & manage a distribution hub</div>
            </div>
            <div class="role-card__check">✓</div>
          </div>
        </div>
      </div>

      <div style="padding:var(--space-4) var(--space-6) calc(var(--space-6) + var(--safe-bottom));">
        <button class="btn btn-primary btn-full btn-lg" id="role-continue" disabled style="opacity:0.6;">
          Continue
        </button>
      </div>
    </div>
  `;
}

export function initRoleSelect(onSelected) {
  let selectedRole = null;
  const cards = document.querySelectorAll('.role-card');
  const continueBtn = document.getElementById('role-continue');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('role-card--selected'));
      card.classList.add('role-card--selected');
      selectedRole = card.dataset.role;
      continueBtn.disabled = false;
      continueBtn.style.opacity = '1';
    });
  });

  continueBtn.addEventListener('click', () => {
    if (!selectedRole) return;
    onSelected(selectedRole);
  });
}
