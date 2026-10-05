const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

const overview = {
  systemTime: '24 May 2025 14:32:45 UTC+05:00',
  systemStatus: 'Operational',
  totalAssets: 1246,
  onlineAssets: 1102,
  offlineAssets: 106,
  maintenanceAssets: 38,
  onlinePercentage: '88.4%',
  alertSummary: {
    critical: 5,
    high: 8,
    medium: 10,
    low: 37
  },
  categories: {
    vehicles: { total: 512, online: 451, percentage: '88%' },
    drones: { total: 128, online: 109, percentage: '85%' },
    personnel: { total: 256, online: 230, percentage: '90%' },
    sensors: { total: 212, online: 184, percentage: '87%' },
    weapons: { total: 98, online: 80, percentage: '82%' }
  }
};

const assets = [
  {
    id: 'VT-1247',
    name: 'Toyota Hilux',
    type: 'Vehicle',
    status: 'Online',
    speed: 82,
    heading: 'SE (135°)',
    location: { latitude: 31.5204, longitude: 74.3587, altitude: 210 },
    driver: 'Ahmed Khan',
    fuelLevel: 73,
    lastUpdate: '14:32:45',
    route: 'Lahore - Wagha Border'
  },
  {
    id: 'VT-5632',
    name: 'Toyota Corolla',
    type: 'Vehicle',
    status: 'Online',
    speed: 64,
    heading: 'SW (220°)',
    location: { latitude: 31.5159, longitude: 74.3255, altitude: 188 },
    driver: 'Usman Ali',
    fuelLevel: 69,
    lastUpdate: '14:31:42',
    route: 'Lahore - Sialkot'
  },
  {
    id: 'DR-2001',
    name: 'Drone 2001',
    type: 'Drone',
    status: 'Online',
    speed: 54,
    heading: 'N (0°)',
    location: { latitude: 31.5102, longitude: 74.3368, altitude: 420 },
    driver: 'Autopilot',
    fuelLevel: 92,
    lastUpdate: '14:29:17',
    route: 'Border Surveillance'
  },
  {
    id: 'SN-2001',
    name: 'Sensor Node 2001',
    type: 'Sensor',
    status: 'Online',
    speed: 0,
    heading: 'Static',
    location: { latitude: 31.5008, longitude: 74.3345, altitude: 94 },
    driver: 'Automated',
    fuelLevel: 100,
    lastUpdate: '14:28:05',
    route: 'Weather Station'
  }
];

const alerts = [
  { timestamp: '14:32:10', type: 'Threat Detected', zone: 'Restricted Zone A', severity: 'CRITICAL', assetId: 'VT-1247' },
  { timestamp: '14:31:45', type: 'Speed Limit Exceeded', zone: 'Route 12', severity: 'HIGH', assetId: 'VT-1247' },
  { timestamp: '14:30:22', type: 'Geo-fence Exit', zone: 'Zone B', severity: 'HIGH', assetId: 'VT-0387' },
  { timestamp: '14:29:50', type: 'Sensor Temperature High', zone: 'SN-2001', severity: 'MEDIUM', assetId: 'SN-2001' },
  { timestamp: '14:28:40', type: 'Route Deviation', zone: 'DR-2001', severity: 'MEDIUM', assetId: 'DR-2001' }
];

const missions = [
  { route: 'Lahore - Wagha Border', distance: '28.4 km', assets: 12, status: 'Active' },
  { route: 'Lahore - Sialkot', distance: '65.2 km', assets: 8, status: 'Active' },
  { route: 'Lahore - Kasur', distance: '37.8 km', assets: 6, status: 'Active' },
  { route: 'Lahore - Narowal', distance: '52.1 km', assets: 5, status: 'Active' }
];

const health = {
  database: 'Healthy',
  webServers: 'Healthy',
  redisCache: 'Healthy',
  storage: 'Healthy',
  backup: 'Healthy',
  security: 'Healthy'
};

const telemetry = {
  engine: { rpm: 2100, status: 'Running' },
  battery: { voltage: '13.6 V', status: 'Healthy' },
  fuel: { level: '73%', status: 'Operational' },
  temperature: { value: '89°C', status: 'Warning' }
};

app.get('/api/overview', (_, res) => {
  res.json(overview);
});

app.get('/api/assets', (_, res) => {
  res.json(assets);
});

app.get('/api/alerts', (_, res) => {
  res.json(alerts);
});

app.get('/api/missions', (_, res) => {
  res.json(missions);
});

app.get('/api/health', (_, res) => {
  res.json(health);
});

app.get('/api/telemetry', (_, res) => {
  res.json(telemetry);
});

app.get('/api/selected-asset', (_, res) => {
  res.json(assets[0]);
});

app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`NEXARA Command Center running on http://localhost:${PORT}`);
});
