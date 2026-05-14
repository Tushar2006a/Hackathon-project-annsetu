// Welcome Success Screen
export function renderWelcome(role) {
  const messages = {
    consumer: { emoji: '🎉', title: 'Welcome!', subtitle: 'Your account is ready. Start exploring fresh produce from local farms.' },
    farmer: { emoji: '🌾', title: 'Farm Created!', subtitle: "You're all set to list your produce and connect with families." },
    hub: { emoji: '🏪', title: 'Hub Created!', subtitle: 'Your distribution hub is live. Farmers and families can now find you.' }
  };
  const msg = messages[role] || messages.consumer;

  return `
    <div class="page-content" style="padding-top:0;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;min-height:100dvh;text-align:center;padding:var(--space-6);">
      <div class="success-check">
        <svg viewBox="0 0 24 24">
          <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      
      <h1 style="font-family:var(--font-heading);font-size:var(--fs-2xl);font-weight:var(--fw-bold);margin-top:var(--space-6);opacity:0;animation:fadeInUp 0.5s var(--ease-out) 0.5s forwards;">${msg.title}</h1>
      <p style="font-size:var(--fs-body);color:var(--text-muted);margin-top:var(--space-2);max-width:260px;opacity:0;animation:fadeInUp 0.5s var(--ease-out) 0.7s forwards;">${msg.subtitle}</p>
      
      <button class="btn btn-primary btn-lg btn-ripple" id="welcome-start" style="margin-top:var(--space-8);opacity:0;animation:fadeInUp 0.5s var(--ease-out) 1s forwards;">
        ${role === 'farmer' ? 'Go to Dashboard' : role === 'hub' ? 'Manage Hub' : 'Start Shopping'} →
      </button>
    </div>
  `;
}

export function initWelcome(role, onStart) {
  // Spawn confetti
  spawnConfetti();
  
  document.getElementById('welcome-start')?.addEventListener('click', () => {
    onStart(role);
  });
}

function spawnConfetti() {
  const colors = ['#E8913A', '#9C7A5B', '#7A8B6F', '#4CAF50', '#FF9800', '#E53935'];
  for (let i = 0; i < 30; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = Math.random() * 2 + 's';
    confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
    confetti.style.width = (6 + Math.random() * 8) + 'px';
    confetti.style.height = (6 + Math.random() * 8) + 'px';
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 5000);
  }
}
