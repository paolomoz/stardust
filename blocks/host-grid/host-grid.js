export default function decorate(block) {
  const rows = [...block.children];
  const get = (name) => {
    const row = rows.find((r) => r.firstElementChild?.textContent.trim().toLowerCase() === name);
    return row?.lastElementChild || null;
  };

  const header = document.createElement('div');
  header.className = 'host-grid-header';

  const eyebrow = get('eyebrow')?.textContent.trim();
  if (eyebrow) {
    const p = document.createElement('p');
    p.className = 'eyebrow';
    p.textContent = eyebrow;
    header.append(p);
  }

  const h = get('headline');
  if (h) {
    const h2 = document.createElement('h2');
    h2.innerHTML = h.innerHTML;
    header.append(h2);
  }

  const lede = get('lede');
  if (lede) {
    const p = document.createElement('p');
    p.className = 'host-grid-lede';
    p.innerHTML = lede.innerHTML;
    header.append(p);
  }

  const grid = document.createElement('div');
  grid.className = 'host-grid-hosts';
  const hostsCell = get('hosts');
  if (hostsCell) {
    hostsCell.querySelectorAll('li, p').forEach((el) => {
      const text = el.textContent.trim();
      if (!text) return;
      // "Claude Code | Available | active" or "SLICC | Next"
      const [name, badge, state] = text.split('|').map((s) => s.trim());
      const host = document.createElement('div');
      host.className = 'host-grid-host';
      if (state === 'active') host.classList.add('active');
      host.innerHTML = `<div class="name">${name || ''}</div><div class="badge">${badge || ''}</div>`;
      grid.append(host);
    });
  }

  block.textContent = '';
  block.append(header, grid);
}
