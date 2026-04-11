export default function decorate(block) {
  const rows = [...block.children];
  rows.forEach((row) => {
    const cols = [...row.children];
    if (cols.length < 2) return;

    const details = cols[0];
    const price = cols[1];

    details.classList.add('menu-list-details');
    price.classList.add('menu-list-price');

    // Style em/i elements as tags
    details.querySelectorAll('em').forEach((em) => {
      em.classList.add('menu-list-tag');
    });
  });
}
