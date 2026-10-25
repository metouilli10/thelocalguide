const filterChips = document.querySelectorAll('.filter-chip');
const catalogCards = document.querySelectorAll('.tour-grid--catalog .tour-card');
const tourCount = document.querySelector('#tour-count');

filterChips.forEach((chip) => chip.addEventListener('click', () => {
  const filter = chip.dataset.filter;
  filterChips.forEach((other) => {
    const active = other === chip;
    other.classList.toggle('is-active', active);
    other.setAttribute('aria-pressed', String(active));
  });
  let shown = 0;
  catalogCards.forEach((card) => {
    const match = filter === 'all' || card.dataset.category === filter;
    card.hidden = !match;
    if (match) shown += 1;
  });
  if (tourCount) tourCount.textContent = shown;
}));
