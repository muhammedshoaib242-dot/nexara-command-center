const initDashboard = async () => {
  const [overview, assets, alerts, missionRoutes, health, telemetry, selectedAsset] = await Promise.all([
    fetch('/api/overview').then((r) => r.json()),
    fetch('/api/assets').then((r) => r.json()),
    fetch('/api/alerts').then((r) => r.json()),
    fetch('/api/missions').then((r) => r.json()),
    fetch('/api/health').then((r) => r.json()),
    fetch('/api/telemetry').then((r) => r.json()),
    fetch('/api/selected-asset').then((r) => r.json())
  ]);

  // System overview
  document.getElementById('system-time').textContent = overview.systemTime;
  document.getElementById('system-status').textContent = overview.systemStatus;
  document.getElementById('summary-assets').textContent = `${overview.totalAssets} total`;
  document.getElementById('summary-online').textContent = `${overview.onlineAssets} online`;
  document.getElementById('summary-alerts').textContent = `${overview.alertSummary.critical + overview.alertSummary.high + overview.alertSummary.medium + overview.alertSummary.low} alerts`;

  // Alert summary counts
  document.getElementById('critical-count').textContent = overview.alertSummary.critical;
  document.getElementById('high-count').textContent = overview.alertSummary.high;
  document.getElementById('medium-count').textContent = overview.alertSummary.medium;
  document.getElementById('low-count').textContent = overview.alertSummary.low;

  // Asset summary
  document.getElementById('asset-total').textContent = overview.totalAssets;
  document.getElementById('online-txt').textContent = `${overview.onlineAssets}`;
  document.getElementById('offline-txt').textContent = `${overview.offlineAssets}`;
  document.getElementById('maintenance-txt').textContent = `${overview.maintenanceAssets}`;

  // Category list
  const categoryList = document.getElementById('category-list');
  const categoryEntries = Object.entries(overview.categories);
  categoryList.innerHTML = categoryEntries.map(([key, value]) => `
    <div class="category-row">
      <span>${key.charAt(0).toUpperCase() + key.slice(1)}</span>
      <strong>${value.total}</strong>
      <div class="bar"><span style="width:${value.percentage.replace('%','')}%"></span></div>
    </div>
  `).join('');

  // Selected asset details
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

  // Recent alert list
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

  // Health list
  const healthList = document.getElementById('system-health');
  healthList.innerHTML = Object.entries(health).map(([key, value]) => `
    <div class="health-row">
      <span class="health-dot"></span>
      <strong>${key.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase())}</strong>
      <small>${value}</small>
    </div>
  `).join('');

  // Routes list
  const routesList = document.getElementById('routes-list');
  routesList.innerHTML = missionRoutes.map((route) => `
    <div class="route-row">
      <div class="route-meta">
        <strong>${route.route}</strong>
        <small>${route.distance} · ${route.assets} assets</small>
      </div>
      <span class="route-status">${route.status}</span>
    </div>
  `).join('');

  // Event stream
  const eventStream = document.getElementById('event-stream');
  eventStream.innerHTML = [
    { time: '14:32:45', label: 'VT-1247 Entered Safe Zone', type: 'Operational' },
    { time: '14:32:10', label: 'Threat Detected in Restricted Zone A', type: 'Critical' },
    { time: '14:31:45', label: 'Speed Limit Exceeded VT-1247', type: 'High' },
    { time: '14:30:22', label: 'VT-0387 Geo-fence Exit', type: 'High' }
  ].map((item) => `
    <div class="event-row">
      <div>
        <strong>${item.label}</strong>
        <small>${item.time}</small>
      </div>
      <span class="tag">${item.type}</span>
    </div>
  `).join('');

  // Telemetry information
  document.querySelector('.gauge-inner span').textContent = `${telemetry.engine.rpm} RPM`;
  const gaugeValues = document.querySelectorAll('.gauge-inner span');
  gaugeValues[0].textContent = `${telemetry.engine.rpm} RPM`;
  gaugeValues[1].textContent = telemetry.battery.voltage;
  gaugeValues[2].textContent = telemetry.fuel.level;
};

initDashboard();
