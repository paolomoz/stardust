export default function decorate(block) {
  const rows = [...block.children];
  const get = (name) => {
    const row = rows.find((r) => r.firstElementChild?.textContent.trim().toLowerCase() === name);
    return row?.lastElementChild || null;
  };

  const left = document.createElement('div');
  left.className = 'need-to-site-body';

  const eyebrow = get('eyebrow')?.textContent.trim();
  if (eyebrow) {
    const p = document.createElement('p');
    p.className = 'eyebrow';
    p.textContent = eyebrow;
    left.append(p);
  }

  const h = get('headline');
  if (h) {
    const h2 = document.createElement('h2');
    h2.innerHTML = h.innerHTML;
    left.append(h2);
  }

  const body = get('body');
  if (body) [...body.children].forEach((c) => left.append(c));

  const needLabel = get('need')?.textContent.trim() || 'a website need';
  const siteLabel = get('site')?.textContent.trim() || 'shipped EDS site';
  const waypointsRaw = get('waypoints')?.textContent.trim() || '';
  const waypoints = waypointsRaw.split(',').map((s) => s.trim()).filter(Boolean);
  const caption = get('caption')?.textContent.trim();

  const diagram = document.createElement('div');
  diagram.className = 'need-to-site-diagram';
  diagram.innerHTML = `
    <div class="need-to-site-line">
      <div class="need-to-site-need">${needLabel}</div>
      <div class="need-to-site-arrow">→</div>
      <div class="need-to-site-site">${siteLabel}</div>
    </div>
    <div class="need-to-site-waypoints">
      ${waypoints.map((w) => `<span>${w}</span>`).join('')}
    </div>
    ${caption ? `<p class="need-to-site-caption">${caption}</p>` : ''}
  `;

  block.textContent = '';
  block.append(left, diagram);
}
