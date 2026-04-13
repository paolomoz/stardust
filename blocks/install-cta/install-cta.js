function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export default function decorate(block) {
  const rows = [...block.children];
  const get = (name) => {
    const row = rows.find((r) => r.firstElementChild?.textContent.trim().toLowerCase() === name);
    return row?.lastElementChild || null;
  };

  const wrap = document.createElement('div');
  wrap.className = 'install-cta-content';

  const eyebrow = get('eyebrow')?.textContent.trim();
  if (eyebrow) {
    const p = document.createElement('p');
    p.className = 'eyebrow';
    p.textContent = eyebrow;
    wrap.append(p);
  }

  const h = get('headline');
  if (h) {
    const h2 = document.createElement('h2');
    h2.innerHTML = h.innerHTML;
    wrap.append(h2);
  }

  const lede = get('lede');
  if (lede) {
    const p = document.createElement('p');
    p.className = 'install-cta-lede';
    p.innerHTML = lede.innerHTML;
    wrap.append(p);
  }

  const cmd = get('command')?.textContent.trim();
  if (cmd) {
    const box = document.createElement('div');
    box.className = 'install-cta-box';
    box.innerHTML = `
      <code class="install-cta-cmd"><span class="sigil">$</span>${esc(cmd)}</code>
      <button type="button" class="install-cta-copy" data-cmd="${esc(cmd)}">Copy</button>
    `;
    box.querySelector('.install-cta-copy').addEventListener('click', (e) => {
      const text = e.currentTarget.dataset.cmd;
      if (navigator.clipboard) navigator.clipboard.writeText(text);
      e.currentTarget.textContent = 'Copied';
      setTimeout(() => { e.currentTarget.textContent = 'Copy'; }, 1500);
    });
    wrap.append(box);
  }

  const fine = get('fine');
  if (fine) {
    const p = document.createElement('p');
    p.className = 'install-cta-fine';
    p.innerHTML = fine.innerHTML;
    wrap.append(p);
  }

  const ctaCell = get('cta');
  if (ctaCell) {
    const row = document.createElement('div');
    row.className = 'install-cta-ctas';
    ctaCell.querySelectorAll('p').forEach((p) => row.append(p));
    wrap.append(row);
  }

  block.textContent = '';
  block.append(wrap);
}
