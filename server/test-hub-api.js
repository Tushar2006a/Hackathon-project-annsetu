// Quick test to check hub API
const hubId = '893deb97-5084-4b13-a819-a4d13528cab7';

try {
  const res = await fetch(`http://localhost:3000/api/hubs/${hubId}`);
  const data = await res.json();
  console.log('GET hub:', JSON.stringify(data, null, 2));
} catch (e) {
  console.error('GET failed:', e.message);
}

try {
  const res = await fetch(`http://localhost:3000/api/hubs/${hubId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test Hub Update', description: 'Testing' })
  });
  const data = await res.json();
  console.log('PUT hub:', JSON.stringify(data, null, 2));
} catch (e) {
  console.error('PUT failed:', e.message);
}
