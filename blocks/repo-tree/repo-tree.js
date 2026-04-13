function escapeWithAccents(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*([^*]+)\*/g, '<span class="star">$1</span>')
    .replace(/\[([^\]]+)\]\s*([^\n]*)/g, (_, dir, comment) => {
      const commentHtml = comment ? ` <span class="comment">${comment}</span>` : '';
      return `<span class="dir">${dir}</span>${commentHtml}`;
    })
    .replace(/\s#\s([^\n]+)$/g, ' <span class="comment"># $1</span>');
}

export default function decorate(block) {
  const rows = [...block.children];
  const get = (name) => {
    const row = rows.find((r) => r.firstElementChild?.textContent.trim().toLowerCase() === name);
    return row?.lastElementChild || null;
  };

  const left = document.createElement('div');
  left.className = 'repo-tree-body';

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

  const ctaCell = get('cta');
  if (ctaCell) {
    const row = document.createElement('div');
    row.className = 'repo-tree-cta';
    ctaCell.querySelectorAll('p').forEach((p) => row.append(p));
    left.append(row);
  }

  const treeCell = get('tree');
  const tree = document.createElement('pre');
  tree.className = 'repo-tree-tree';
  if (treeCell) {
    const lines = [];
    treeCell.querySelectorAll('li, p').forEach((el) => {
      const raw = el.textContent;
      // honor leading spaces: replace with NBSP-like rendering via pre
      lines.push(escapeWithAccents(raw));
    });
    tree.innerHTML = lines.join('\n');
  }

  block.textContent = '';
  block.append(left, tree);
}
