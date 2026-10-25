const guideFilters = document.querySelectorAll('.guide-filter');
const guideCards = document.querySelectorAll('.article-card');
const articleCount = document.querySelector('#article-count');

guideFilters.forEach((button) => {
  button.addEventListener('click', () => {
    const selected = button.dataset.filter;
    guideFilters.forEach((filter) => {
      const active = filter === button;
      filter.classList.toggle('is-active', active);
      filter.setAttribute('aria-pressed', String(active));
    });

    let visible = 0;
    guideCards.forEach((card) => {
      const categories = (card.dataset.categories || '').split(' ');
      const show = selected === 'all' || categories.includes(selected);
      card.hidden = !show;
      if (show) visible += 1;
    });
    if (articleCount) articleCount.textContent = visible;
  });
});
