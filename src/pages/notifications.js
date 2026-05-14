// Notification Center
import { renderAppHeader } from '../components/navbar.js';
import { notifications } from '../data/mock-data.js';

export function renderNotifications() {
  const today = notifications.filter(n => n.time.includes('min') || n.time.includes('hr'));
  const earlier = notifications.filter(n => !n.time.includes('min') && !n.time.includes('hr'));

  return `
    ${renderAppHeader('Notifications', true)}
    <main class="page-content">
      ${notifications.length === 0 ? `
        <div class="empty-state">
          <div class="empty-state__icon">🔔</div>
          <p class="empty-state__text">All caught up!</p>
          <p style="font-size:var(--fs-sm);color:var(--text-muted);">No new notifications</p>
        </div>
      ` : `
        ${today.length > 0 ? `
          <div style="padding:var(--space-3) var(--space-4) var(--space-1);">
            <span style="font-size:var(--fs-xs);font-weight:var(--fw-semibold);color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em;">Today</span>
          </div>
          ${today.map(n => renderNotifItem(n)).join('')}
        ` : ''}

        ${earlier.length > 0 ? `
          <div style="padding:var(--space-3) var(--space-4) var(--space-1);">
            <span style="font-size:var(--fs-xs);font-weight:var(--fw-semibold);color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em;">Earlier</span>
          </div>
          ${earlier.map(n => renderNotifItem(n)).join('')}
        ` : ''}
      `}
      <div style="height:var(--space-8);"></div>
    </main>
  `;
}

function renderNotifItem(n) {
  return `
    <div class="notif-item ${n.unread ? 'notif-item--unread' : ''}" data-notif-id="${n.id}">
      <div class="notif-item__icon" style="background:${n.bg};">${n.icon}</div>
      <div class="notif-item__body">
        <div class="notif-item__title">${n.title}</div>
        <div class="notif-item__desc">${n.desc}</div>
        <div class="notif-item__time">${n.time}</div>
      </div>
      ${n.unread ? `<div style="width:8px;height:8px;border-radius:50%;background:var(--green);flex-shrink:0;"></div>` : ''}
    </div>
  `;
}

export function initNotifications() {
  document.querySelectorAll('.notif-item--unread').forEach(item => {
    item.addEventListener('click', () => {
      item.classList.remove('notif-item--unread');
      const dot = item.querySelector('div:last-child');
      if (dot && dot.style.width === '8px') dot.style.display = 'none';
    });
  });
}
