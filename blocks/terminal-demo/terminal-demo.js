export default function decorate(block) {
  const rows = [...block.children];
  const get = (name) => {
    const row = rows.find((r) => r.firstElementChild?.textContent.trim().toLowerCase() === name);
    return row?.lastElementChild || null;
  };

  const left = document.createElement('div');
  left.className = 'terminal-demo-body';

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

  const scriptCell = get('script');
  const terminal = document.createElement('div');
  terminal.className = 'terminal-demo-window';
  terminal.innerHTML = '<div class="terminal-demo-chrome"><span></span><span></span><span></span></div>';

  if (scriptCell) {
    scriptCell.querySelectorAll('li, p').forEach((el) => {
      const text = el.textContent.trim();
      const line = document.createElement('div');
      line.className = 'terminal-demo-line';
      if (!text) {
        line.innerHTML = '&nbsp;';
      } else if (text.startsWith('▸') || text.startsWith('>')) {
        const cmd = text.replace(/^[▸>]\s*/, '');
        line.classList.add('cmd');
        line.innerHTML = `<span class="caret">▸</span> <span class="cmd-text">${cmd}</span>`;
      } else {
        line.classList.add('out');
        line.innerHTML = text.replace(/`([^`]+)`/g, '<span class="star">$1</span>');
      }
      terminal.append(line);
    });
  }

  block.textContent = '';
  block.append(left, terminal);
}
