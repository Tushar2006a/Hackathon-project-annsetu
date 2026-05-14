// Consumer Operations Helpers

export function getActiveHub(hubs, preferredId = '') {
  if (!Array.isArray(hubs) || hubs.length === 0) return null;
  if (preferredId) {
    const match = hubs.find(h => h.id === preferredId);
    if (match) return match;
  }
  return [...hubs].sort((a, b) => a.distanceKm - b.distanceKm)[0];
}

export function formatEta(etaMins) {
  if (!etaMins && etaMins !== 0) return 'ETA NA';
  return etaMins <= 59 ? `${etaMins} min` : `${Math.round(etaMins / 60)} hr`;
}

export function getFreshnessMeta(product) {
  const raw = product?.harvestedAt || product?.freshness;
  if (!raw) return { label: 'Fresh', tone: 'green' };
  const dt = new Date(raw);
  if (Number.isNaN(dt.getTime())) return { label: product.freshness || 'Fresh', tone: 'green' };
  const hours = Math.max(1, Math.round((Date.now() - dt.getTime()) / 3600000));
  if (hours <= 6) return { label: 'Harvested today', tone: 'green', hours };
  if (hours <= 24) return { label: 'Harvested <24h', tone: 'green', hours };
  if (hours <= 72) return { label: 'Harvested 3 days', tone: 'earth', hours };
  return { label: product.freshness || 'Fresh', tone: 'earth', hours };
}

export function getDemandMeta(product) {
  let demand = 0;
  if (product?.stock !== undefined && product.stock <= 10) demand += 0.08;
  if (String(product?.deliveryEta || '').includes('20')) demand += 0.05;
  if (product?.isSeasonal) demand += 0.03;
  demand = Math.min(demand, 0.15);
  return {
    multiplier: demand,
    label: demand > 0 ? `Peak +${Math.round(demand * 100)}%` : 'Standard price',
  };
}

export function getDynamicPrice(product) {
  const { multiplier } = getDemandMeta(product);
  const listPrice = product.originalPrice && product.originalPrice > product.price
    ? product.originalPrice
    : product.price;
  const rawPrice = Math.round(product.price * (1 + multiplier));
  const price = Math.min(rawPrice, listPrice);
  return { price, multiplier };
}

export function getStockMeta(product) {
  if (!product) return { label: 'Unknown', tone: 'muted' };
  if (product.stock === 0) return { label: 'Out of stock', tone: 'error' };
  if (product.stock <= 5) return { label: 'Very low', tone: 'error' };
  if (product.stock <= 10) return { label: 'Low stock', tone: 'warning' };
  return { label: 'In stock', tone: 'green' };
}

export function getBatchForProduct(batches, productId, hubId) {
  if (!Array.isArray(batches)) return null;
  return batches
    .filter(b => b.productId === productId && (!hubId || b.hubId === hubId))
    .sort((a, b) => (a.fifoRank || 0) - (b.fifoRank || 0))[0] || null;
}

export function getRecommendedSlot(slots) {
  if (!Array.isArray(slots)) return null;
  return slots.find(s => s.recommended && s.available) || slots.find(s => s.available && !s.surge) || slots[0];
}
