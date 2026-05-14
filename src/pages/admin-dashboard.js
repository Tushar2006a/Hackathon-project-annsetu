export function renderAdminDashboard() {
  const adminProfile = JSON.parse(localStorage.getItem('annsetu_admin_profile') || '{}');
  const adminName = adminProfile.name || 'Super Admin';
  const adminRole = adminProfile.role || 'Ops Commander';
  const adminHub = adminProfile.hub || 'Pune Central Hub';
  const adminInitials = adminName
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'SA';
  return `
    <div class="admin-shell">
      <aside class="admin-sidebar">
        <div class="admin-brand">
          <div class="admin-brand__mark">A</div>
          <div>
            <div class="admin-brand__title">Annsetu Ops</div>
            <div class="admin-brand__meta">Supply Chain Control Center</div>
          </div>
        </div>

        <div class="admin-hub">
          <div class="admin-label">Active Hub</div>
          <div class="admin-select">
            <select aria-label="Select hub">
              <option>${adminHub}</option>
              <option>Mumbai East Hub</option>
              <option>Nashik Valley Hub</option>
              <option>Ahmedabad City Hub</option>
            </select>
          </div>
          <div class="admin-hub__stats">
            <div>
              <div class="admin-hub__value">92%</div>
              <div class="admin-hub__label">Capacity</div>
            </div>
            <div>
              <div class="admin-hub__value">4.6h</div>
              <div class="admin-hub__label">Avg Turnaround</div>
            </div>
            <div>
              <div class="admin-hub__value">18</div>
              <div class="admin-hub__label">Active Zones</div>
            </div>
          </div>
        </div>

        <nav class="admin-nav" aria-label="Admin navigation">
          <button class="admin-nav__link admin-nav__link--active" data-section="ops">Ops Center</button>
          <button class="admin-nav__link" data-section="farmers">Farmers</button>
          <button class="admin-nav__link" data-section="procurement">Procurement</button>
          <button class="admin-nav__link" data-section="inventory">Inventory</button>
          <button class="admin-nav__link" data-section="waste">Waste</button>
          <button class="admin-nav__link" data-section="hub">Hub Ops</button>
          <button class="admin-nav__link" data-section="orders">Orders</button>
          <button class="admin-nav__link" data-section="delivery">Delivery</button>
          <button class="admin-nav__link" data-section="pricing">Pricing</button>
          <button class="admin-nav__link" data-section="payments">Payments</button>
          <button class="admin-nav__link" data-section="support">Support</button>
          <button class="admin-nav__link" data-section="analytics">Analytics</button>
          <button class="admin-nav__link" data-section="reports">Reports</button>
          <button class="admin-nav__link" data-section="system">System</button>
        </nav>

        <div class="admin-sidebar__footer">
          <div class="admin-sidebar__cta">
            <div class="admin-label">Ops Actions</div>
            <button class="admin-action">Create procurement plan</button>
            <button class="admin-action">Dispatch priority batch</button>
            <button class="admin-action">Freeze surge pricing</button>
          </div>
          <button id="admin-logout-btn" class="admin-logout">Log out</button>
        </div>
      </aside>

      <div class="admin-main">
        <header class="admin-topbar">
          <div class="admin-topbar__left">
            <div class="admin-title-block">
              <div class="admin-eyebrow">Admin Operations Panel</div>
              <h1>Control Center</h1>
              <p>Realtime visibility across farmers, hubs, inventory, delivery, and finance.</p>
            </div>
            <div class="admin-live">
              <span class="admin-pulse" aria-hidden="true"></span>
              Live feed
              <span id="admin-sync-time">--:--</span>
            </div>
          </div>
          <div class="admin-topbar__right">
            <div class="admin-search">
              <input class="admin-input" type="text" placeholder="Search farmers, batches, orders, zones" aria-label="Search" />
            </div>
            <div class="admin-actions">
              <button class="admin-icon-btn" id="admin-theme-toggle" aria-label="Toggle theme" aria-pressed="false">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
                  <path d="M12 3a1 1 0 011 1v2a1 1 0 11-2 0V4a1 1 0 011-1z" />
                  <path d="M5.64 5.64a1 1 0 011.41 0l1.42 1.42a1 1 0 11-1.41 1.41L5.64 7.05a1 1 0 010-1.41z" />
                  <path d="M3 12a1 1 0 011-1h2a1 1 0 110 2H4a1 1 0 01-1-1z" />
                  <path d="M5.64 18.36a1 1 0 010-1.41l1.42-1.42a1 1 0 111.41 1.41l-1.42 1.42a1 1 0 01-1.41 0z" />
                  <path d="M12 18a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1z" />
                  <path d="M18.36 18.36a1 1 0 01-1.41 0l-1.42-1.42a1 1 0 111.41-1.41l1.42 1.42a1 1 0 010 1.41z" />
                  <path d="M18 12a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" />
                  <path d="M18.36 5.64a1 1 0 010 1.41l-1.42 1.42a1 1 0 11-1.41-1.41l1.42-1.42a1 1 0 011.41 0z" />
                  <circle cx="12" cy="12" r="4" />
                </svg>
              </button>
              <button class="admin-icon-btn" aria-label="Notifications">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
                  <path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 01-3.46 0" />
                </svg>
                <span class="admin-dot"></span>
              </button>
              <button class="admin-user">
                <span class="admin-user__avatar">${adminInitials}</span>
                <span class="admin-user__meta">
                  <span>${adminName}</span>
                  <small>${adminRole}</small>
                </span>
              </button>
            </div>
          </div>
        </header>

        <div class="admin-content">
          <section id="ops" class="admin-section">
            <div class="admin-section__header">
              <div>
                <h2>Real-time Operations Dashboard</h2>
                <p>Core KPIs with live alerts, demand spikes, and margin impact.</p>
              </div>
              <div class="admin-section__actions">
                <button class="admin-btn">Ops snapshot</button>
                <button class="admin-btn admin-btn--ghost">Export report</button>
              </div>
            </div>
            <div class="admin-kpi-grid">
              <div class="admin-card admin-kpi">
                <div class="admin-kpi__label">Orders today</div>
                <div class="admin-kpi__value">12,480</div>
                <div class="admin-kpi__meta">+8.4% vs yesterday</div>
              </div>
              <div class="admin-card admin-kpi">
                <div class="admin-kpi__label">Active deliveries</div>
                <div class="admin-kpi__value">312</div>
                <div class="admin-kpi__meta">14 at risk of SLA</div>
              </div>
              <div class="admin-card admin-kpi">
                <div class="admin-kpi__label">Live inventory</div>
                <div class="admin-kpi__value">58,320 kg</div>
                <div class="admin-kpi__meta">4.8 days cover</div>
              </div>
              <div class="admin-card admin-kpi admin-kpi--warning">
                <div class="admin-kpi__label">Low stock alerts</div>
                <div class="admin-kpi__value">23 SKUs</div>
                <div class="admin-kpi__meta">Top risk: Tomato, Spinach</div>
              </div>
              <div class="admin-card admin-kpi">
                <div class="admin-kpi__label">Revenue today</div>
                <div class="admin-kpi__value">INR 2.14M</div>
                <div class="admin-kpi__meta">Gross margin 18.6%</div>
              </div>
              <div class="admin-card admin-kpi admin-kpi--alert">
                <div class="admin-kpi__label">Wastage today</div>
                <div class="admin-kpi__value">2.6%</div>
                <div class="admin-kpi__meta">INR 112K loss</div>
              </div>
              <div class="admin-card admin-kpi">
                <div class="admin-kpi__label">Pending farmer payouts</div>
                <div class="admin-kpi__value">INR 1.82M</div>
                <div class="admin-kpi__meta">Due in 3 days</div>
              </div>
              <div class="admin-card admin-kpi">
                <div class="admin-kpi__label">Near-expiry batches</div>
                <div class="admin-kpi__value">18</div>
                <div class="admin-kpi__meta">72 hours remaining</div>
              </div>
            </div>

            <div class="admin-grid">
              <div class="admin-card">
                <div class="admin-card__header">
                  <h3>Operational alerts</h3>
                  <span class="admin-tag admin-tag--warning">6 open</span>
                </div>
                <ul class="admin-list">
                  <li>
                    <div>
                      <strong>Demand spike detected</strong>
                      <span>Tomato demand +48% in Pune West.</span>
                    </div>
                    <span class="admin-tag admin-tag--alert">Critical</span>
                  </li>
                  <li>
                    <div>
                      <strong>Cold storage temp drift</strong>
                      <span>Zone C2 at 8.6C for 22 min.</span>
                    </div>
                    <span class="admin-tag admin-tag--warning">Monitor</span>
                  </li>
                  <li>
                    <div>
                      <strong>Rider shortage</strong>
                      <span>South cluster short of 6 riders.</span>
                    </div>
                    <span class="admin-tag">Queue</span>
                  </li>
                </ul>
              </div>
              <div class="admin-card">
                <div class="admin-card__header">
                  <h3>Live activity feed</h3>
                  <span class="admin-tag admin-tag--success">Streaming</span>
                </div>
                <ul class="admin-feed">
                  <li>
                    <span class="admin-feed__dot"></span>
                    <div>
                      <strong>Batch BAT-1141 accepted</strong>
                      <span>Ladyfinger, Grade A, 420 kg.</span>
                    </div>
                    <span class="admin-time">2m</span>
                  </li>
                  <li>
                    <span class="admin-feed__dot"></span>
                    <div>
                      <strong>Route optimized</strong>
                      <span>Zone East consolidation saved 18 km.</span>
                    </div>
                    <span class="admin-time">8m</span>
                  </li>
                  <li>
                    <span class="admin-feed__dot"></span>
                    <div>
                      <strong>Farmer KYC approved</strong>
                      <span>Shreya Farms, Nashik.</span>
                    </div>
                    <span class="admin-time">12m</span>
                  </li>
                  <li>
                    <span class="admin-feed__dot"></span>
                    <div>
                      <strong>Inventory rebalanced</strong>
                      <span>2.4 tons moved to Mumbai East.</span>
                    </div>
                    <span class="admin-time">21m</span>
                  </li>
                </ul>
              </div>
            </div>
            <div class="admin-grid">
              <div class="admin-card">
                <div class="admin-card__header">
                  <h3>Fast-moving products</h3>
                  <span class="admin-tag">Top 6</span>
                </div>
                <ul class="admin-metric-list">
                  <li>
                    <div>
                      <strong>Tomato 1kg</strong>
                      <span>Sell-through 92%, cover 1.1d</span>
                    </div>
                    <span class="admin-pill admin-pill--up">+18%</span>
                  </li>
                  <li>
                    <div>
                      <strong>Leafy greens mix</strong>
                      <span>Sell-through 88%, cover 1.6d</span>
                    </div>
                    <span class="admin-pill admin-pill--up">+11%</span>
                  </li>
                  <li>
                    <div>
                      <strong>Onion 1kg</strong>
                      <span>Sell-through 81%, cover 2.2d</span>
                    </div>
                    <span class="admin-pill">+6%</span>
                  </li>
                  <li>
                    <div>
                      <strong>Banana 1 dozen</strong>
                      <span>Sell-through 77%, cover 1.8d</span>
                    </div>
                    <span class="admin-pill">+4%</span>
                  </li>
                </ul>
              </div>
              <div class="admin-card">
                <div class="admin-card__header">
                  <h3>Realtime order tracking</h3>
                  <span class="admin-tag">Last 60 min</span>
                </div>
                <div class="admin-progress-list">
                  <div>
                    <div class="admin-progress__label">Packed within 30 min</div>
                    <div class="admin-progress__bar"><span style="--value: 78%"></span></div>
                    <div class="admin-progress__meta">78% target 85%</div>
                  </div>
                  <div>
                    <div class="admin-progress__label">Dispatch SLA</div>
                    <div class="admin-progress__bar"><span style="--value: 92%"></span></div>
                    <div class="admin-progress__meta">92% target 95%</div>
                  </div>
                  <div>
                    <div class="admin-progress__label">Delivery on time</div>
                    <div class="admin-progress__bar"><span style="--value: 94%"></span></div>
                    <div class="admin-progress__meta">94% target 96%</div>
                  </div>
                  <div>
                    <div class="admin-progress__label">Refund turnaround</div>
                    <div class="admin-progress__bar"><span style="--value: 84%"></span></div>
                    <div class="admin-progress__meta">84% target 90%</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="farmers" class="admin-section">
            <div class="admin-section__header">
              <div>
                <h2>Farmer management</h2>
                <p>Onboarding, KYC, supply consistency, and payout readiness.</p>
              </div>
              <button class="admin-btn admin-btn--ghost">Review onboarding</button>
            </div>
            <div class="admin-grid">
              <div class="admin-card">
                <div class="admin-card__header">
                  <h3>KYC queue</h3>
                  <span class="admin-tag">9 pending</span>
                </div>
                <ul class="admin-list">
                  <li>
                    <div>
                      <strong>Mehta Agro</strong>
                      <span>Tomato, Onion, Carrot. ID verified.</span>
                    </div>
                    <span class="admin-tag admin-tag--warning">Docs pending</span>
                  </li>
                  <li>
                    <div>
                      <strong>Green Valley Co-op</strong>
                      <span>Leafy greens. 3 hubs capacity.</span>
                    </div>
                    <span class="admin-tag admin-tag--success">Ready</span>
                  </li>
                  <li>
                    <div>
                      <strong>Shreya Farms</strong>
                      <span>Organic only. Quality grade B.</span>
                    </div>
                    <span class="admin-tag">Verification</span>
                  </li>
                </ul>
              </div>
              <div class="admin-card">
                <div class="admin-card__header">
                  <h3>Top farmer performance</h3>
                  <span class="admin-tag admin-tag--success">95% supply consistency</span>
                </div>
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>Farmer</th>
                      <th>Fill rate</th>
                      <th>Quality</th>
                      <th>Payout status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Rao Organics</td>
                      <td>98%</td>
                      <td>Grade A</td>
                      <td><span class="admin-tag admin-tag--success">Cleared</span></td>
                    </tr>
                    <tr>
                      <td>Krishna Produce</td>
                      <td>95%</td>
                      <td>Grade A</td>
                      <td><span class="admin-tag">Due in 2d</span></td>
                    </tr>
                    <tr>
                      <td>Sahyadri Farms</td>
                      <td>91%</td>
                      <td>Grade B+</td>
                      <td><span class="admin-tag admin-tag--warning">Hold</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section id="procurement" class="admin-section">
            <div class="admin-section__header">
              <div>
                <h2>Procurement management</h2>
                <p>Demand-based intake, quality grading, and pickup planning.</p>
              </div>
              <div class="admin-section__actions">
                <button class="admin-btn">Run demand forecast</button>
                <button class="admin-btn admin-btn--ghost">Price update</button>
              </div>
            </div>
            <div class="admin-grid">
              <div class="admin-card">
                <div class="admin-card__header">
                  <h3>Procurement pipeline</h3>
                  <span class="admin-tag">Today</span>
                </div>
                <div class="admin-pipeline">
                  <div>
                    <span>Submitted</span>
                    <strong>64</strong>
                    <div class="admin-pipeline__item">Tomato 3.2t</div>
                    <div class="admin-pipeline__item">Spinach 1.1t</div>
                  </div>
                  <div>
                    <span>Quality check</span>
                    <strong>28</strong>
                    <div class="admin-pipeline__item">Potato 2.8t</div>
                    <div class="admin-pipeline__item">Okra 0.9t</div>
                  </div>
                  <div>
                    <span>Accepted</span>
                    <strong>42</strong>
                    <div class="admin-pipeline__item">Onion 4.4t</div>
                    <div class="admin-pipeline__item">Banana 1.6t</div>
                  </div>
                  <div>
                    <span>Scheduled</span>
                    <strong>19</strong>
                    <div class="admin-pipeline__item">Pickup Route 7</div>
                    <div class="admin-pipeline__item">Pickup Route 9</div>
                  </div>
                  <div>
                    <span>In transit</span>
                    <strong>11</strong>
                    <div class="admin-pipeline__item">Truck 04</div>
                    <div class="admin-pipeline__item">Truck 12</div>
                  </div>
                </div>
              </div>
              <div class="admin-card">
                <div class="admin-card__header">
                  <h3>Procurement calendar</h3>
                  <span class="admin-tag">Village-wise</span>
                </div>
                <ul class="admin-list">
                  <li>
                    <div>
                      <strong>06:30 - 08:00</strong>
                      <span>Baramati, 12 farmers, leafy greens.</span>
                    </div>
                    <span class="admin-tag">Route A</span>
                  </li>
                  <li>
                    <div>
                      <strong>08:30 - 10:00</strong>
                      <span>Indapur, 9 farmers, tomato and onion.</span>
                    </div>
                    <span class="admin-tag admin-tag--success">Confirmed</span>
                  </li>
                  <li>
                    <div>
                      <strong>11:00 - 12:30</strong>
                      <span>Manchar, 7 farmers, mixed vegetables.</span>
                    </div>
                    <span class="admin-tag admin-tag--warning">Pending</span>
                  </li>
                </ul>
                <div class="admin-mini-chart">
                  <div class="admin-mini-chart__label">Forecast vs demand (next 3 days)</div>
                  <div class="admin-mini-chart__bars">
                    <span style="--value: 70%"></span>
                    <span style="--value: 86%"></span>
                    <span style="--value: 62%"></span>
                    <span style="--value: 78%"></span>
                    <span style="--value: 91%"></span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="inventory" class="admin-section">
            <div class="admin-section__header">
              <div>
                <h2>Inventory management</h2>
                <p>Batch-level visibility with FIFO, expiry, and quality grading.</p>
              </div>
              <button class="admin-btn admin-btn--ghost">Open warehouse view</button>
            </div>
            <div class="admin-card">
              <div class="admin-card__header">
                <h3>Live inventory by batch</h3>
                <span class="admin-tag admin-tag--warning">5 expiry risks</span>
              </div>
              <div class="admin-table-wrap">
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Batch ID</th>
                      <th>Farmer</th>
                      <th>Qty</th>
                      <th>Cost</th>
                      <th>Arrival</th>
                      <th>Expiry</th>
                      <th>Grade</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Tomato</td>
                      <td>BAT-1184</td>
                      <td>Rao Organics</td>
                      <td>920 kg</td>
                      <td>INR 18.4/kg</td>
                      <td>May 10</td>
                      <td>May 13</td>
                      <td>A</td>
                      <td><span class="admin-tag admin-tag--warning">Near expiry</span></td>
                    </tr>
                    <tr>
                      <td>Onion</td>
                      <td>BAT-1181</td>
                      <td>Krishna Produce</td>
                      <td>1,420 kg</td>
                      <td>INR 12.2/kg</td>
                      <td>May 09</td>
                      <td>May 20</td>
                      <td>A</td>
                      <td><span class="admin-tag admin-tag--success">Stable</span></td>
                    </tr>
                    <tr>
                      <td>Spinach</td>
                      <td>BAT-1179</td>
                      <td>Green Valley Co-op</td>
                      <td>320 kg</td>
                      <td>INR 22.5/kg</td>
                      <td>May 11</td>
                      <td>May 12</td>
                      <td>A</td>
                      <td><span class="admin-tag admin-tag--alert">Expire in 24h</span></td>
                    </tr>
                    <tr>
                      <td>Potato</td>
                      <td>BAT-1187</td>
                      <td>Sahyadri Farms</td>
                      <td>2,140 kg</td>
                      <td>INR 9.4/kg</td>
                      <td>May 08</td>
                      <td>May 22</td>
                      <td>B+</td>
                      <td><span class="admin-tag">FIFO next</span></td>
                    </tr>
                    <tr>
                      <td>Banana</td>
                      <td>BAT-1182</td>
                      <td>Mehta Agro</td>
                      <td>760 kg</td>
                      <td>INR 26.0/kg</td>
                      <td>May 10</td>
                      <td>May 14</td>
                      <td>A</td>
                      <td><span class="admin-tag admin-tag--warning">Discount 12%</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="admin-grid">
              <div class="admin-card">
                <div class="admin-card__header">
                  <h3>Damage and wastage log</h3>
                  <span class="admin-tag admin-tag--alert">12 incidents</span>
                </div>
                <ul class="admin-list">
                  <li>
                    <div>
                      <strong>Spinach batch BAT-1179</strong>
                      <span>Quality rejection, 42 kg lost.</span>
                    </div>
                    <span class="admin-tag admin-tag--alert">Discard</span>
                  </li>
                  <li>
                    <div>
                      <strong>Tomato batch BAT-1184</strong>
                      <span>Transit damage, 18 kg salvaged.</span>
                    </div>
                    <span class="admin-tag admin-tag--warning">Markdown</span>
                  </li>
                  <li>
                    <div>
                      <strong>Banana batch BAT-1182</strong>
                      <span>Cold storage drift, 26 kg risk.</span>
                    </div>
                    <span class="admin-tag">Monitor</span>
                  </li>
                </ul>
              </div>
              <div class="admin-card">
                <div class="admin-card__header">
                  <h3>Expiry rescue plan</h3>
                  <span class="admin-tag">Next 72h</span>
                </div>
                <ul class="admin-list">
                  <li>
                    <div>
                      <strong>Markdown queue</strong>
                      <span>Apply 14% discount to 9 batches.</span>
                    </div>
                    <span class="admin-tag admin-tag--warning">Active</span>
                  </li>
                  <li>
                    <div>
                      <strong>Cross-hub transfer</strong>
                      <span>Move 480 kg to Mumbai East.</span>
                    </div>
                    <span class="admin-tag">Scheduled</span>
                  </li>
                  <li>
                    <div>
                      <strong>Donation partners</strong>
                      <span>Reserve 120 kg for NGOs.</span>
                    </div>
                    <span class="admin-tag admin-tag--success">Approved</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section id="waste" class="admin-section">
            <div class="admin-section__header">
              <div>
                <h2>Waste management</h2>
                <p>Track wastage drivers, recovery actions, and sustainability goals.</p>
              </div>
              <button class="admin-btn admin-btn--ghost">Open waste analytics</button>
            </div>
            <div class="admin-grid">
              <div class="admin-card">
                <div class="admin-card__header">
                  <h3>Wastage breakdown</h3>
                  <span class="admin-tag">Today</span>
                </div>
                <div class="admin-stat-grid">
                  <div>
                    <div class="admin-stat__value">1.1%</div>
                    <div class="admin-stat__label">Quality rejection</div>
                  </div>
                  <div>
                    <div class="admin-stat__value">0.8%</div>
                    <div class="admin-stat__label">Transit damage</div>
                  </div>
                  <div>
                    <div class="admin-stat__value">0.6%</div>
                    <div class="admin-stat__label">Expiry loss</div>
                  </div>
                  <div>
                    <div class="admin-stat__value">0.1%</div>
                    <div class="admin-stat__label">Pack errors</div>
                  </div>
                </div>
                <div class="admin-mini-chart">
                  <div class="admin-mini-chart__label">Wastage trend (7 days)</div>
                  <div class="admin-mini-chart__bars">
                    <span style="--value: 28%"></span>
                    <span style="--value: 34%"></span>
                    <span style="--value: 31%"></span>
                    <span style="--value: 26%"></span>
                    <span style="--value: 22%"></span>
                  </div>
                </div>
              </div>
              <div class="admin-card">
                <div class="admin-card__header">
                  <h3>Recovery actions</h3>
                  <span class="admin-tag admin-tag--success">Active</span>
                </div>
                <ul class="admin-list">
                  <li>
                    <div>
                      <strong>Rescue bundles</strong>
                      <span>Launch 3 bundles for near-expiry SKUs.</span>
                    </div>
                    <span class="admin-tag">In progress</span>
                  </li>
                  <li>
                    <div>
                      <strong>Supplier quality audit</strong>
                      <span>Schedule visits for 4 farmers.</span>
                    </div>
                    <span class="admin-tag admin-tag--warning">Pending</span>
                  </li>
                  <li>
                    <div>
                      <strong>Compost partner pickup</strong>
                      <span>Collection planned for tomorrow.</span>
                    </div>
                    <span class="admin-tag admin-tag--success">Confirmed</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section id="hub" class="admin-section">
            <div class="admin-section__header">
              <div>
                <h2>Hub operations</h2>
                <p>Zone utilization, packaging throughput, and staff assignments.</p>
              </div>
              <button class="admin-btn admin-btn--ghost">Open hub logs</button>
            </div>
            <div class="admin-grid">
              <div class="admin-card">
                <div class="admin-card__header">
                  <h3>Zone utilization</h3>
                  <span class="admin-tag">Live</span>
                </div>
                <div class="admin-heatmap">
                  <div class="heat-3"></div>
                  <div class="heat-4"></div>
                  <div class="heat-2"></div>
                  <div class="heat-1"></div>
                  <div class="heat-4"></div>
                  <div class="heat-3"></div>
                  <div class="heat-2"></div>
                  <div class="heat-3"></div>
                  <div class="heat-1"></div>
                  <div class="heat-2"></div>
                  <div class="heat-4"></div>
                  <div class="heat-3"></div>
                </div>
                <div class="admin-heatmap__legend">
                  <span>Low</span>
                  <span>Peak load</span>
                </div>
              </div>
              <div class="admin-card">
                <div class="admin-card__header">
                  <h3>Shift assignments</h3>
                  <span class="admin-tag admin-tag--success">On schedule</span>
                </div>
                <ul class="admin-list">
                  <li>
                    <div>
                      <strong>Packaging Team A</strong>
                      <span>08:00 - 16:00, 14 staff.</span>
                    </div>
                    <span class="admin-tag">412 orders</span>
                  </li>
                  <li>
                    <div>
                      <strong>Cold Storage Team</strong>
                      <span>06:00 - 14:00, 6 staff.</span>
                    </div>
                    <span class="admin-tag">2 incidents</span>
                  </li>
                  <li>
                    <div>
                      <strong>Dispatch Team</strong>
                      <span>10:00 - 18:00, 10 staff.</span>
                    </div>
                    <span class="admin-tag admin-tag--warning">Short 2</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section id="orders" class="admin-section">
            <div class="admin-section__header">
              <div>
                <h2>Order management</h2>
                <p>Smart allocation, issue resolution, and fulfillment velocity.</p>
              </div>
              <button class="admin-btn">Open order board</button>
            </div>
            <div class="admin-grid">
              <div class="admin-card">
                <div class="admin-card__header">
                  <h3>Order pipeline</h3>
                  <span class="admin-tag">Today</span>
                </div>
                <div class="admin-pipeline admin-pipeline--compact">
                  <div>
                    <span>Placed</span>
                    <strong>3,240</strong>
                  </div>
                  <div>
                    <span>Allocated</span>
                    <strong>2,890</strong>
                  </div>
                  <div>
                    <span>Packed</span>
                    <strong>2,610</strong>
                  </div>
                  <div>
                    <span>Ready</span>
                    <strong>2,210</strong>
                  </div>
                  <div>
                    <span>Out for delivery</span>
                    <strong>1,980</strong>
                  </div>
                  <div>
                    <span>Delivered</span>
                    <strong>1,720</strong>
                  </div>
                </div>
              </div>
              <div class="admin-card">
                <div class="admin-card__header">
                  <h3>Exception queue</h3>
                  <span class="admin-tag admin-tag--alert">28 open</span>
                </div>
                <ul class="admin-list">
                  <li>
                    <div>
                      <strong>Order #54821</strong>
                      <span>Missing item: Tomato 500g.</span>
                    </div>
                    <span class="admin-tag">Resolve</span>
                  </li>
                  <li>
                    <div>
                      <strong>Order #54804</strong>
                      <span>Customer requested reschedule.</span>
                    </div>
                    <span class="admin-tag admin-tag--warning">Pending</span>
                  </li>
                  <li>
                    <div>
                      <strong>Order #54788</strong>
                      <span>Inventory mismatch on leafy greens.</span>
                    </div>
                    <span class="admin-tag admin-tag--alert">Critical</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section id="delivery" class="admin-section">
            <div class="admin-section__header">
              <div>
                <h2>Delivery management</h2>
                <p>Route optimization, rider allocation, and ETA control.</p>
              </div>
              <div class="admin-section__actions">
                <button class="admin-btn">Optimize routes</button>
                <button class="admin-btn admin-btn--ghost">Batch deliveries</button>
              </div>
            </div>
            <div class="admin-grid">
              <div class="admin-card">
                <div class="admin-card__header">
                  <h3>Live delivery board</h3>
                  <span class="admin-tag">312 active</span>
                </div>
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>Zone</th>
                      <th>Riders</th>
                      <th>Stops</th>
                      <th>ETA</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>North Pune</td>
                      <td>24</td>
                      <td>102</td>
                      <td>28 min</td>
                      <td><span class="admin-tag admin-tag--success">On track</span></td>
                    </tr>
                    <tr>
                      <td>East Pune</td>
                      <td>18</td>
                      <td>88</td>
                      <td>41 min</td>
                      <td><span class="admin-tag admin-tag--warning">At risk</span></td>
                    </tr>
                    <tr>
                      <td>South Pune</td>
                      <td>14</td>
                      <td>64</td>
                      <td>36 min</td>
                      <td><span class="admin-tag">Rebalance</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="admin-card">
                <div class="admin-card__header">
                  <h3>Delivery heatmap</h3>
                  <span class="admin-tag admin-tag--warning">Hot zones</span>
                </div>
                <div class="admin-heatmap admin-heatmap--dense">
                  <div class="heat-4"></div>
                  <div class="heat-4"></div>
                  <div class="heat-3"></div>
                  <div class="heat-2"></div>
                  <div class="heat-3"></div>
                  <div class="heat-2"></div>
                  <div class="heat-1"></div>
                  <div class="heat-2"></div>
                  <div class="heat-3"></div>
                  <div class="heat-4"></div>
                  <div class="heat-2"></div>
                  <div class="heat-1"></div>
                  <div class="heat-2"></div>
                  <div class="heat-3"></div>
                  <div class="heat-4"></div>
                  <div class="heat-3"></div>
                </div>
                <div class="admin-heatmap__legend">
                  <span>Low</span>
                  <span>High demand</span>
                </div>
              </div>
            </div>
          </section>

          <section id="pricing" class="admin-section">
            <div class="admin-section__header">
              <div>
                <h2>Pricing management</h2>
                <p>Dynamic pricing, near-expiry discounts, and campaign control.</p>
              </div>
              <button class="admin-btn admin-btn--ghost">Launch campaign</button>
            </div>
            <div class="admin-grid">
              <div class="admin-card">
                <div class="admin-card__header">
                  <h3>Dynamic pricing rules</h3>
                  <span class="admin-tag">Auto</span>
                </div>
                <ul class="admin-list">
                  <li>
                    <div>
                      <strong>Demand surge +12%</strong>
                      <span>Tomato, Onion, Leafy greens.</span>
                    </div>
                    <span class="admin-tag admin-tag--success">Active</span>
                  </li>
                  <li>
                    <div>
                      <strong>Inventory cover &lt; 2 days</strong>
                      <span>Auto raise 8% for 9 SKUs.</span>
                    </div>
                    <span class="admin-tag">Scheduled</span>
                  </li>
                  <li>
                    <div>
                      <strong>Near-expiry markdown 18%</strong>
                      <span>Applies to 11 batches today.</span>
                    </div>
                    <span class="admin-tag admin-tag--warning">Running</span>
                  </li>
                </ul>
              </div>
              <div class="admin-card">
                <div class="admin-card__header">
                  <h3>Promotion performance</h3>
                  <span class="admin-tag">This week</span>
                </div>
                <div class="admin-stat-grid">
                  <div>
                    <div class="admin-stat__value">14.2%</div>
                    <div class="admin-stat__label">Lift in conversion</div>
                  </div>
                  <div>
                    <div class="admin-stat__value">INR 420K</div>
                    <div class="admin-stat__label">Revenue from offers</div>
                  </div>
                  <div>
                    <div class="admin-stat__value">28%</div>
                    <div class="admin-stat__label">Inventory cleared</div>
                  </div>
                </div>
                <div class="admin-mini-chart">
                  <div class="admin-mini-chart__label">Campaign ROI</div>
                  <div class="admin-mini-chart__bars">
                    <span style="--value: 40%"></span>
                    <span style="--value: 52%"></span>
                    <span style="--value: 62%"></span>
                    <span style="--value: 58%"></span>
                    <span style="--value: 70%"></span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="payments" class="admin-section">
            <div class="admin-section__header">
              <div>
                <h2>Payments and financials</h2>
                <p>Settlements, profit tracking, and operating cost control.</p>
              </div>
              <button class="admin-btn admin-btn--ghost">Download P and L</button>
            </div>
            <div class="admin-grid">
              <div class="admin-card">
                <div class="admin-card__header">
                  <h3>Settlement queue</h3>
                  <span class="admin-tag">Weekly batch</span>
                </div>
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>Farmer</th>
                      <th>Amount</th>
                      <th>Due</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Rao Organics</td>
                      <td>INR 220K</td>
                      <td>May 14</td>
                      <td><span class="admin-tag">Queued</span></td>
                    </tr>
                    <tr>
                      <td>Green Valley Co-op</td>
                      <td>INR 160K</td>
                      <td>May 15</td>
                      <td><span class="admin-tag admin-tag--success">Approved</span></td>
                    </tr>
                    <tr>
                      <td>Mehta Agro</td>
                      <td>INR 92K</td>
                      <td>May 16</td>
                      <td><span class="admin-tag admin-tag--warning">Hold</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="admin-card">
                <div class="admin-card__header">
                  <h3>Profit tracker</h3>
                  <span class="admin-tag">Month to date</span>
                </div>
                <div class="admin-stat-grid">
                  <div>
                    <div class="admin-stat__value">INR 28.4M</div>
                    <div class="admin-stat__label">Gross revenue</div>
                  </div>
                  <div>
                    <div class="admin-stat__value">INR 20.1M</div>
                    <div class="admin-stat__label">Procurement cost</div>
                  </div>
                  <div>
                    <div class="admin-stat__value">INR 4.2M</div>
                    <div class="admin-stat__label">Ops expenses</div>
                  </div>
                  <div>
                    <div class="admin-stat__value">INR 4.1M</div>
                    <div class="admin-stat__label">Net profit</div>
                  </div>
                </div>
                <div class="admin-mini-chart">
                  <div class="admin-mini-chart__label">Daily margin trend</div>
                  <div class="admin-mini-chart__bars">
                    <span style="--value: 44%"></span>
                    <span style="--value: 52%"></span>
                    <span style="--value: 41%"></span>
                    <span style="--value: 60%"></span>
                    <span style="--value: 58%"></span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="support" class="admin-section">
            <div class="admin-section__header">
              <div>
                <h2>Customer support management</h2>
                <p>Ticket resolution, refunds, and quality issue tracking.</p>
              </div>
              <button class="admin-btn admin-btn--ghost">Open ticket desk</button>
            </div>
            <div class="admin-grid">
              <div class="admin-card">
                <div class="admin-card__header">
                  <h3>Active ticket queue</h3>
                  <span class="admin-tag">42 open</span>
                </div>
                <ul class="admin-list">
                  <li>
                    <div>
                      <strong>Order #54892</strong>
                      <span>Quality complaint on spinach.</span>
                    </div>
                    <span class="admin-tag admin-tag--warning">Inspection</span>
                  </li>
                  <li>
                    <div>
                      <strong>Order #54811</strong>
                      <span>Delivery delayed, 2 hours.</span>
                    </div>
                    <span class="admin-tag">Escalated</span>
                  </li>
                  <li>
                    <div>
                      <strong>Order #54762</strong>
                      <span>Refund request for damaged tomatoes.</span>
                    </div>
                    <span class="admin-tag admin-tag--success">Approved</span>
                  </li>
                </ul>
              </div>
              <div class="admin-card">
                <div class="admin-card__header">
                  <h3>Refund analytics</h3>
                  <span class="admin-tag">Last 7 days</span>
                </div>
                <div class="admin-stat-grid">
                  <div>
                    <div class="admin-stat__value">1.2%</div>
                    <div class="admin-stat__label">Refund rate</div>
                  </div>
                  <div>
                    <div class="admin-stat__value">INR 86K</div>
                    <div class="admin-stat__label">Refund value</div>
                  </div>
                  <div>
                    <div class="admin-stat__value">48%</div>
                    <div class="admin-stat__label">Quality related</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="analytics" class="admin-section">
            <div class="admin-section__header">
              <div>
                <h2>Analytics and reporting</h2>
                <p>Demand forecasting, retention insights, and hub benchmarks.</p>
              </div>
              <div class="admin-section__actions">
                <button class="admin-btn">Generate weekly report</button>
                <button class="admin-btn admin-btn--ghost">Export CSV</button>
              </div>
            </div>
            <div class="admin-grid">
              <div class="admin-card">
                <div class="admin-card__header">
                  <h3>AI insights</h3>
                  <span class="admin-tag admin-tag--success">Updated</span>
                </div>
                <ul class="admin-list">
                  <li>
                    <div>
                      <strong>High waste risk</strong>
                      <span>Spinach demand softening in East Pune.</span>
                    </div>
                    <span class="admin-tag admin-tag--warning">Action</span>
                  </li>
                  <li>
                    <div>
                      <strong>Retention boost</strong>
                      <span>Mid-week bundles improve repeats by 12%.</span>
                    </div>
                    <span class="admin-tag admin-tag--success">Adopt</span>
                  </li>
                  <li>
                    <div>
                      <strong>Farmer risk</strong>
                      <span>Supplier drop predicted in Zone 4.</span>
                    </div>
                    <span class="admin-tag">Investigate</span>
                  </li>
                </ul>
              </div>
              <div class="admin-card">
                <div class="admin-card__header">
                  <h3>Multi-hub performance</h3>
                  <span class="admin-tag">City view</span>
                </div>
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>Hub</th>
                      <th>Fill rate</th>
                      <th>Wastage</th>
                      <th>OTD</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Pune Central</td>
                      <td>97%</td>
                      <td>2.4%</td>
                      <td>96.2%</td>
                    </tr>
                    <tr>
                      <td>Mumbai East</td>
                      <td>94%</td>
                      <td>3.1%</td>
                      <td>93.4%</td>
                    </tr>
                    <tr>
                      <td>Nashik Valley</td>
                      <td>95%</td>
                      <td>2.1%</td>
                      <td>95.8%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section id="reports" class="admin-section">
            <div class="admin-section__header">
              <div>
                <h2>Operational reports</h2>
                <p>Daily, weekly, and ad-hoc operational reporting across hubs.</p>
              </div>
              <div class="admin-section__actions">
                <button class="admin-btn">Generate daily report</button>
                <button class="admin-btn admin-btn--ghost">Export PDF</button>
              </div>
            </div>
            <div class="admin-grid">
              <div class="admin-card">
                <div class="admin-card__header">
                  <h3>Report schedule</h3>
                  <span class="admin-tag">Auto send</span>
                </div>
                <ul class="admin-list">
                  <li>
                    <div>
                      <strong>Daily ops summary</strong>
                      <span>06:00 AM, hub managers + finance.</span>
                    </div>
                    <span class="admin-tag admin-tag--success">Active</span>
                  </li>
                  <li>
                    <div>
                      <strong>Weekly procurement report</strong>
                      <span>Monday 09:30 AM, leadership team.</span>
                    </div>
                    <span class="admin-tag">Scheduled</span>
                  </li>
                  <li>
                    <div>
                      <strong>Monthly P and L</strong>
                      <span>First business day, finance only.</span>
                    </div>
                    <span class="admin-tag">Pending</span>
                  </li>
                </ul>
              </div>
              <div class="admin-card">
                <div class="admin-card__header">
                  <h3>Export center</h3>
                  <span class="admin-tag">On demand</span>
                </div>
                <ul class="admin-metric-list">
                  <li>
                    <div>
                      <strong>Inventory snapshot</strong>
                      <span>CSV, batch-level detail.</span>
                    </div>
                    <span class="admin-pill">1.2 MB</span>
                  </li>
                  <li>
                    <div>
                      <strong>Delivery SLA report</strong>
                      <span>XLSX, last 7 days.</span>
                    </div>
                    <span class="admin-pill">820 KB</span>
                  </li>
                  <li>
                    <div>
                      <strong>Farmer payout ledger</strong>
                      <span>PDF, weekly batch.</span>
                    </div>
                    <span class="admin-pill">410 KB</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section id="system" class="admin-section">
            <div class="admin-section__header">
              <div>
                <h2>System governance</h2>
                <p>Roles, access, audit trails, and notification rules.</p>
              </div>
              <button class="admin-btn admin-btn--ghost">Open security center</button>
            </div>
            <div class="admin-grid">
              <div class="admin-card">
                <div class="admin-card__header">
                  <h3>Roles and sessions</h3>
                  <span class="admin-tag">RBAC</span>
                </div>
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>Role</th>
                      <th>Access scope</th>
                      <th>Active users</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Super Admin</td>
                      <td>All modules</td>
                      <td>2</td>
                    </tr>
                    <tr>
                      <td>Hub Manager</td>
                      <td>Hub, inventory, orders</td>
                      <td>8</td>
                    </tr>
                    <tr>
                      <td>Delivery Manager</td>
                      <td>Routes, riders, SLA</td>
                      <td>6</td>
                    </tr>
                    <tr>
                      <td>Support Executive</td>
                      <td>Tickets, refunds</td>
                      <td>12</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="admin-card">
                <div class="admin-card__header">
                  <h3>Notification and alerts</h3>
                  <span class="admin-tag">Realtime</span>
                </div>
                <ul class="admin-list">
                  <li>
                    <div>
                      <strong>Low stock threshold</strong>
                      <span>Alert at &lt; 1.5 days cover.</span>
                    </div>
                    <span class="admin-tag">Enabled</span>
                  </li>
                  <li>
                    <div>
                      <strong>Delivery delay</strong>
                      <span>Alert if ETA &gt; 35 min.</span>
                    </div>
                    <span class="admin-tag admin-tag--warning">Escalate</span>
                  </li>
                  <li>
                    <div>
                      <strong>Payment failure</strong>
                      <span>Auto retry 2 times.</span>
                    </div>
                    <span class="admin-tag">Active</span>
                  </li>
                </ul>
              </div>
            </div>
            <div class="admin-grid">
              <div class="admin-card">
                <div class="admin-card__header">
                  <h3>Activity logs</h3>
                  <span class="admin-tag">Last 24h</span>
                </div>
                <ul class="admin-feed">
                  <li>
                    <span class="admin-feed__dot"></span>
                    <div>
                      <strong>Role updated</strong>
                      <span>Inventory Manager permissions expanded.</span>
                    </div>
                    <span class="admin-time">2h</span>
                  </li>
                  <li>
                    <span class="admin-feed__dot"></span>
                    <div>
                      <strong>Alert rule changed</strong>
                      <span>Low stock threshold set to 1.2 days.</span>
                    </div>
                    <span class="admin-time">5h</span>
                  </li>
                  <li>
                    <span class="admin-feed__dot"></span>
                    <div>
                      <strong>Settlement approved</strong>
                      <span>INR 820K released to farmers.</span>
                    </div>
                    <span class="admin-time">9h</span>
                  </li>
                </ul>
              </div>
              <div class="admin-card">
                <div class="admin-card__header">
                  <h3>Active sessions</h3>
                  <span class="admin-tag">5 online</span>
                </div>
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Role</th>
                      <th>Last action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Rhea Kapoor</td>
                      <td>Super Admin</td>
                      <td>2 min ago</td>
                    </tr>
                    <tr>
                      <td>Kiran Mehta</td>
                      <td>Inventory Manager</td>
                      <td>18 min ago</td>
                    </tr>
                    <tr>
                      <td>Akash Rana</td>
                      <td>Delivery Manager</td>
                      <td>34 min ago</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  `;
}

export function initAdminDashboard() {
  const themeToggle = document.getElementById('admin-theme-toggle');
  const storedTheme = localStorage.getItem('annsetu_admin_theme');
  const applyTheme = (theme) => {
    if (theme === 'dark') {
      document.body.dataset.theme = 'dark';
      themeToggle?.setAttribute('aria-pressed', 'true');
    } else {
      document.body.removeAttribute('data-theme');
      themeToggle?.setAttribute('aria-pressed', 'false');
    }
    localStorage.setItem('annsetu_admin_theme', theme);
  };
  if (storedTheme) {
    applyTheme(storedTheme);
  }

  themeToggle?.addEventListener('click', () => {
    const nextTheme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  });

  const navLinks = document.querySelectorAll('.admin-nav__link');
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.forEach((item) => item.classList.remove('admin-nav__link--active'));
      link.classList.add('admin-nav__link--active');
      const targetId = link.dataset.section;
      const target = targetId ? document.getElementById(targetId) : null;
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  const syncTimeEl = document.getElementById('admin-sync-time');
  const updateTime = () => {
    if (!syncTimeEl) return;
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    syncTimeEl.textContent = `${hours}:${minutes}`;
  };
  updateTime();
  setInterval(updateTime, 30000);

  document.getElementById('admin-logout-btn')?.addEventListener('click', () => {
    localStorage.removeItem('annsetu_user');
    window.location.hash = '#/';
    location.reload();
  });
}
