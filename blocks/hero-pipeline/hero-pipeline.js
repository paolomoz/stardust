export default function decorate(block) {
  const rows = [...block.children];
  const get = (name) => {
    const row = rows.find((r) => r.firstElementChild?.textContent.trim().toLowerCase() === name);
    return row?.lastElementChild || null;
  };

  const eyebrow = get('eyebrow')?.textContent.trim();
  const headlineCell = get('headline');
  const ledeCell = get('lede');
  const ctasCell = get('ctas');
  const stepsCell = get('steps');
  const phasesCell = get('phases');

  const art = document.createElement('div');
  art.className = 'hero-pipeline-art';

  if (stepsCell) {
    const groups = stepsCell.textContent.split('|').map((g) => g.trim()).filter(Boolean);
    const grid = document.createElement('div');
    grid.className = 'hero-pipeline-diagram';
    let index = 0;
    groups.forEach((group, gi) => {
      group.split(',').forEach((step) => {
        const s = step.trim();
        if (!s) return;
        const [num, ...nameParts] = s.split(/\s+/);
        const div = document.createElement('div');
        div.className = 'hero-pipeline-step';
        if (gi === 1) div.classList.add('eds');
        div.innerHTML = `<span class="num">${num}</span><span class="name">${nameParts.join(' ')}</span>`;
        grid.append(div);
        index += 1;
      });
    });
    grid.style.setProperty('--step-count', index);
    art.append(grid);
  }

  if (phasesCell) {
    const phases = phasesCell.textContent.split('|').map((p) => p.trim()).filter(Boolean);
    const bar = document.createElement('div');
    bar.className = 'hero-pipeline-phases';
    phases.forEach((label, i) => {
      const d = document.createElement('div');
      if (i === 1) d.classList.add('eds');
      d.textContent = label;
      bar.append(d);
    });
    art.append(bar);
  }

  const content = document.createElement('div');
  content.className = 'hero-pipeline-content';

  if (eyebrow) {
    const p = document.createElement('p');
    p.className = 'eyebrow';
    p.textContent = eyebrow;
    content.append(p);
  }

  if (headlineCell) {
    const h1 = document.createElement('h1');
    const lines = [...headlineCell.querySelectorAll('p')];
    if (lines.length > 1) {
      h1.innerHTML = lines.map((l) => `<span class="line">${l.innerHTML}</span>`).join('');
    } else {
      h1.innerHTML = headlineCell.innerHTML;
    }
    content.append(h1);
  }

  if (ledeCell) {
    const lede = document.createElement('p');
    lede.className = 'lede';
    lede.innerHTML = ledeCell.innerHTML;
    content.append(lede);
  }

  if (ctasCell) {
    const row = document.createElement('div');
    row.className = 'hero-pipeline-ctas';
    ctasCell.querySelectorAll('p').forEach((p) => row.append(p));
    content.append(row);
  }

  block.textContent = '';
  block.append(content, art);
}
