const loginScreen = document.getElementById('login-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');

let authToken = localStorage.getItem('nexara-token') || '';

function setAuthVisible(isLoggedIn) {
  loginScreen.classList.toggle('active', !isLoggedIn);
  loginScreen.classList.toggle('hidden', isLoggedIn);
  dashboardScreen.classList.toggle('hidden', !isLoggedIn);
}

async function fetchDashboard() {
  if (!authToken) return;

  try {
    const res = await fetch('/api/dashboard', {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    if (res.status === 401) {
      localStorage.removeItem('nexara-token');
      authToken = '';
      setAuthVisible(false);
      return;
    }

    const data = await res.json();
    renderDashboard(data);
  } catch (err) {
    console.error('Dashboard fetch failed', err);
  }
}

function renderDashboard(data) {
  const { overview, alerts, missions, health, telemetry, selectedAsset } = data;

  document.getElementById('system-time').textContent = overview.systemTime;
  document.getElementById('system-status').textContent = overview.systemStatus;
  document.getElementById('summary-assets').textContent = `${overview.totalAssets} total`;
  document.getElementById('summary-online').textContent = `${overview.onlineAssets} online`;
  document.getElementById('summary-alerts').textContent = `${overview.alertSummary.critical + overview.alertSummary.high + overview.alertSummary.medium + overview.alertSummary.low} alerts`;

  document.getElementById('critical-count').textContent = overview.alertSummary.critical;
  document.getElementById('high-count').textContent = overview.alertSummary.high;
  document.getElementById('medium-count').textContent = overview.alertSummary.medium;
  document.getElementById('low-count').textContent = overview.alertSummary.low;

  document.getElementById('asset-total').textContent = overview.totalAssets;
  document.getElementById('online-txt').textContent = `${overview.onlineAssets}`;
  document.getElementById('offline-txt').textContent = `${overview.offlineAssets}`;
  document.getElementById('maintenance-txt').textContent = `${overview.maintenanceAssets}`;

  const categoryList = document.getElementById('category-list');
  categoryList.innerHTML = Object.entries(overview.categories).map(([key, value]) => `
    <div class="category-row">
      <span>${key.charAt(0).toUpperCase() + key.slice(1)}</span>
      <strong>${value.total}</strong>
      <div class="bar"><span style="width:${Number(value.percentage.replace('%', ''))}%"></span></div>
    </div>
  `).join('');

  const selectedAssetContainer = document.getElementById('selected-asset');
  selectedAssetContainer.innerHTML = `
    <div class="asset-card-main">
      <div class="asset-photo"></div>
      <div class="asset-meta">
        <h4>${selectedAsset.id}</h4>
        <p>${selectedAsset.name}</p>
        <p>${selectedAsset.type} · <span class="positive">${selectedAsset.status}</span></p>
      </div>
    </div>
    <div class="asset-details">
      <div class="detail-box">
        <span>Speed</span>
        <strong>${selectedAsset.speed} km/h</strong>
      </div>
      <div class="detail-box">
        <span>Heading</span>
        <strong>${selectedAsset.heading}</strong>
      </div>
      <div class="detail-box">
        <span>Location</span>
        <strong>${selectedAsset.location.latitude.toFixed(4)}, ${selectedAsset.location.longitude.toFixed(4)}</strong>
      </div>
      <div class="detail-box">
        <span>Altitude</span>
        <strong>${selectedAsset.location.altitude} m</strong>
      </div>
      <div class="detail-box">
        <span>Fuel</span>
        <strong>${selectedAsset.fuelLevel}%</strong>
      </div>
      <div class="detail-box">
        <span>Driver</span>
        <strong>${selectedAsset.driver}</strong>
      </div>
    </div>
  `;

  const recentAlerts = document.getElementById('recent-alerts');
  recentAlerts.innerHTML = alerts.map((alert) => `
    <div class="alert-entry">
      <div>
        <strong>${alert.type}</strong>
        <small>${alert.timestamp} · ${alert.zone}</small>
      </div>
      <span class="tag">${alert.severity}</span>
    </div>
  `).join('');

  const healthList = document.getElementById('system-health');
  healthList.innerHTML = Object.entries(health).map(([key, value]) => `
    <div class="health-row">
      <span class="health-dot"></span>
      <strong>${key.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase())}</strong>
      <small>${value}</small>
    </div>
  `).join('');

  const routesList = document.getElementById('routes-list');
  routesList.innerHTML = missions.map((route) => `
    <div class="route-row">
      <div class="route-meta">
        <strong>${route.route}</strong>
        <small>${route.distance} · ${route.assets} assets</small>
      </div>
      <span class="route-status">${route.status}</span>
    </div>
  `).join('');

  const eventStream = document.getElementById('event-stream');
  eventStream.innerHTML = [
    { time: overview.systemTime, label: 'VT-1247 Entered Safe Zone', type: 'Operational' },
    { time: alerts[0]?.timestamp || '14:32:10', label: alerts[0]?.type || 'Threat Detected in Restricted Zone A', type: alerts[0]?.severity || 'Critical' },
    { time: alerts[1]?.timestamp || '14:31:45', label: alerts[1]?.type || 'Speed Limit Exceeded VT-1247', type: alerts[1]?.severity || 'High' },
    { time: alerts[2]?.timestamp || '14:30:22', label: alerts[2]?.type || 'VT-0387 Geo-fence Exit', type: alerts[2]?.severity || 'High' }
  ].map((item) => `
    <div class="event-row">
      <div>
        <strong>${item.label}</strong>
        <small>${item.time}</small>
      </div>
      <span class="tag">${item.type}</span>
    </div>
  `).join('');

  document.querySelectorAll('.gauge-inner span')[0].textContent = `${telemetry.engine.rpm} RPM`;
  document.querySelectorAll('.gauge-inner span')[1].textContent = telemetry.battery.voltage;
  document.querySelectorAll('.gauge-inner span')[2].textContent = telemetry.fuel.level;
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      alert(data.message || 'Login failed');
      return;
    }

    authToken = data.token;
    localStorage.setItem('nexara-token', authToken);
    setAuthVisible(true);
    fetchDashboard();
  } catch (err) {
    console.error('Login failed', err);
    alert('Unable to connect to the server');
  }
});

logoutBtn.addEventListener('click', async () => {
  if (!authToken) return;

  await fetch('/api/logout', {
    method: 'POST',
    headers: { Authorization: `Bearer ${authToken}` }
  });

  localStorage.removeItem('nexara-token');
  authToken = '';
  setAuthVisible(false);
});

if (authToken) {
  setAuthVisible(true);
  fetchDashboard();
  setInterval(fetchDashboard, 4000);
} else {
  setAuthVisible(false);
}
