export default function decorate(block) {
  const rows = [...block.children];
  const get = (name) => {
    const row = rows.find((r) => r.firstElementChild?.textContent.trim().toLowerCase() === name);
    return row?.lastElementChild || null;
  };

  const header = document.createElement('div');
  header.className = 'pipeline-flow-header';

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

  const sub = get('sub');
  if (sub) {
    const p = document.createElement('p');
    p.className = 'pipeline-flow-sub';
    p.innerHTML = sub.innerHTML;
    header.append(p);
  }

  const phasesCell = get('phases');
  if (phasesCell) {
    const wrap = document.createElement('div');
    wrap.className = 'pipeline-flow-phases';
    phasesCell.textContent.split('|').map((p) => p.trim()).filter(Boolean).forEach((label, i) => {
      const tag = document.createElement('span');
      tag.className = 'pipeline-flow-phase-tag';
      if (i === 1) tag.classList.add('eds');
      tag.textContent = label;
      wrap.append(tag);
    });
    header.append(wrap);
  }

  const flow = document.createElement('div');
  flow.className = 'pipeline-flow-grid';
  const nodesCell = get('nodes');
  if (nodesCell) {
    nodesCell.querySelectorAll('li, p').forEach((el, i) => {
      const text = el.textContent.trim();
      if (!text) return;
      // Expected: "05 · /stardust:eds-design | EDS design | Design tokens, CSS scaffolds."
      const parts = text.split('|').map((s) => s.trim());
      const [num, title, desc] = parts;
      const node = document.createElement('div');
      node.className = 'pipeline-flow-node';
      if (i >= 4) node.classList.add('eds');
      node.innerHTML = `
        <span class="num">${num || ''}</span>
        <span class="title">${title || ''}</span>
        <span class="desc">${desc || ''}</span>
      `;
      flow.append(node);
    });
  }

  block.textContent = '';
  block.append(header, flow);
}
