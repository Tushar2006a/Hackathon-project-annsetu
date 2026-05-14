// Customer Support Page with AI Chatbot
import { renderAppHeader } from '../components/navbar.js';
import { supportFAQs } from '../data/mock-data.js';

const botResponses = {
  'track': 'You can track your order from Orders → tap any active order. You\'ll see real-time status with delivery partner info.',
  'missing': 'Sorry to hear that! Please go to your order → Report Issue → Missing Items. We\'ll refund or redeliver within 2 hours.',
  'refund': 'Refunds are processed within 24-48 hours to your original payment method. For UPI, it\'s usually instant!',
  'cancel': 'You can cancel before dispatch from Order Tracking → Cancel. Once dispatched, contact us for return.',
  'subscription': 'Manage subscriptions from Profile → Subscriptions. You can pause, skip, or cancel anytime.',
  'default': 'I\'m here to help! You can ask about orders, refunds, subscriptions, or delivery. Or tap a quick action below.'
};

export function renderSupport() {
  return `
    ${renderAppHeader('Help & Support', true)}
    <main class="page-content">
      <!-- Quick Actions -->
      <div class="px" style="padding-top:var(--space-4);">
        <h3 style="font-family:var(--font-heading);font-weight:var(--fw-bold);font-size:var(--fs-md);margin-bottom:var(--space-3);">Quick Actions</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3);">
          <div class="card" style="text-align:center;padding:var(--space-3);cursor:pointer;" onclick="window.location.hash='#/orders'">
            <div style="font-size:1.3rem;margin-bottom:4px;">📦</div>
            <div style="font-size:var(--fs-sm);font-weight:var(--fw-semibold);">Missing Items</div>
          </div>
          <div class="card" style="text-align:center;padding:var(--space-3);cursor:pointer;">
            <div style="font-size:1.3rem;margin-bottom:4px;">🔄</div>
            <div style="font-size:var(--fs-sm);font-weight:var(--fw-semibold);">Replacement</div>
          </div>
          <div class="card" style="text-align:center;padding:var(--space-3);cursor:pointer;">
            <div style="font-size:1.3rem;margin-bottom:4px;">💰</div>
            <div style="font-size:var(--fs-sm);font-weight:var(--fw-semibold);">Refund</div>
          </div>
          <div class="card" style="text-align:center;padding:var(--space-3);cursor:pointer;">
            <div style="font-size:1.3rem;margin-bottom:4px;">🚚</div>
            <div style="font-size:var(--fs-sm);font-weight:var(--fw-semibold);">Delivery Issue</div>
          </div>
        </div>
      </div>

      <hr class="divider" />

      <!-- AI Chat -->
      <div class="px" style="padding-top:var(--space-4);">
        <h3 style="font-family:var(--font-heading);font-weight:var(--fw-bold);font-size:var(--fs-md);margin-bottom:var(--space-3);">💬 Chat with us</h3>
        <div id="chat-area" style="background:var(--bg-secondary);border-radius:var(--radius-lg);padding:var(--space-3);min-height:200px;max-height:300px;overflow-y:auto;display:flex;flex-direction:column;gap:var(--space-2);">
          <div class="chat-bubble chat-bubble--bot">👋 Hi! I'm your Annsetu assistant. How can I help you today?</div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:var(--space-2);margin-top:var(--space-2);" id="quick-replies">
          <button class="filter-chip quick-reply" data-key="track">Track order</button>
          <button class="filter-chip quick-reply" data-key="missing">Missing items</button>
          <button class="filter-chip quick-reply" data-key="refund">Refund status</button>
          <button class="filter-chip quick-reply" data-key="cancel">Cancel order</button>
          <button class="filter-chip quick-reply" data-key="subscription">Subscriptions</button>
        </div>
        <div style="display:flex;gap:var(--space-2);margin-top:var(--space-3);">
          <input type="text" class="input" placeholder="Type your message..." id="chat-input" />
          <button class="btn btn-primary btn-sm" id="chat-send" style="min-width:50px;">Send</button>
        </div>
      </div>

      <hr class="divider" />

      <!-- FAQs -->
      <div class="px" style="padding-top:var(--space-4);padding-bottom:var(--space-4);">
        <h3 style="font-family:var(--font-heading);font-weight:var(--fw-bold);font-size:var(--fs-md);margin-bottom:var(--space-3);">📖 FAQs</h3>
        ${supportFAQs.map((faq, i) => `
          <div class="card" style="margin-bottom:var(--space-2);cursor:pointer;" data-faq="${i}">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <div style="font-weight:var(--fw-medium);font-size:var(--fs-sm);">${faq.q}</div>
              <span class="faq-arrow" style="color:var(--text-muted);transition:transform 0.2s;">▸</span>
            </div>
            <div class="faq-answer" style="display:none;margin-top:var(--space-2);font-size:var(--fs-sm);color:var(--text-secondary);line-height:var(--lh-relaxed);">${faq.a}</div>
          </div>
        `).join('')}
      </div>

      <hr class="divider" />

      <!-- Contact -->
      <div class="px" style="padding:var(--space-4);">
        <h3 style="font-family:var(--font-heading);font-weight:var(--fw-bold);font-size:var(--fs-md);margin-bottom:var(--space-3);">Contact Us</h3>
        <div class="stack" style="padding:0;">
          <div class="card" style="display:flex;align-items:center;gap:var(--space-3);cursor:pointer;">
            <span style="font-size:1.3rem;">📞</span>
            <div><div style="font-weight:var(--fw-semibold);font-size:var(--fs-sm);">Call Support</div><div style="font-size:var(--fs-xs);color:var(--text-muted);">Mon-Sat, 8 AM – 8 PM</div></div>
          </div>
          <div class="card" style="display:flex;align-items:center;gap:var(--space-3);cursor:pointer;">
            <span style="font-size:1.3rem;">📧</span>
            <div><div style="font-weight:var(--fw-semibold);font-size:var(--fs-sm);">Email</div><div style="font-size:var(--fs-xs);color:var(--text-muted);">support@annsetu.in</div></div>
          </div>
        </div>
      </div>

      <div style="height:var(--space-8);"></div>
    </main>
  `;
}

export function initSupport() {
  const chatArea = document.getElementById('chat-area');
  const chatInput = document.getElementById('chat-input');

  function addMsg(text, isUser) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble chat-bubble--${isUser ? 'user' : 'bot'}`;
    bubble.textContent = text;
    chatArea.appendChild(bubble);
    chatArea.scrollTop = chatArea.scrollHeight;
  }

  function botReply(key) {
    setTimeout(() => {
      const typing = document.createElement('div');
      typing.className = 'chat-bubble chat-bubble--bot';
      typing.innerHTML = '<div class="dots-loading"><span></span><span></span><span></span></div>';
      chatArea.appendChild(typing);
      chatArea.scrollTop = chatArea.scrollHeight;
      setTimeout(() => {
        typing.textContent = botResponses[key] || botResponses.default;
        chatArea.scrollTop = chatArea.scrollHeight;
      }, 1000);
    }, 300);
  }

  document.querySelectorAll('.quick-reply').forEach(btn => {
    btn.addEventListener('click', () => {
      addMsg(btn.textContent, true);
      botReply(btn.dataset.key);
    });
  });

  document.getElementById('chat-send')?.addEventListener('click', () => {
    const text = chatInput?.value?.trim();
    if (!text) return;
    addMsg(text, true);
    chatInput.value = '';
    const key = Object.keys(botResponses).find(k => text.toLowerCase().includes(k)) || 'default';
    botReply(key);
  });

  chatInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('chat-send')?.click();
  });

  // FAQ accordion
  document.querySelectorAll('[data-faq]').forEach(card => {
    card.addEventListener('click', () => {
      const answer = card.querySelector('.faq-answer');
      const arrow = card.querySelector('.faq-arrow');
      const isOpen = answer.style.display !== 'none';
      answer.style.display = isOpen ? 'none' : 'block';
      arrow.style.transform = isOpen ? '' : 'rotate(90deg)';
    });
  });
}
