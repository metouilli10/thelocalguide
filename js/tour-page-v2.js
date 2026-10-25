(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  menuButton?.addEventListener('click', () => {
    const opened = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(opened));
    menuButton.setAttribute('aria-label', opened ? 'Close menu' : 'Open menu');
    mobileNav.hidden = !opened;
  });

  const dateInput = document.querySelector('#tour-date');
  const today = new Date();
  const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  dateInput.min = localDate;

  const bookingForm = document.querySelector('#booking-form');
  const packageSelect = document.querySelector('#tour-package');
  document.querySelectorAll('[data-package-choice]').forEach((link) => {
    link.addEventListener('click', () => {
      if (!packageSelect) return;
      const option = Array.from(packageSelect.options).find(
        (item) => item.dataset.choice === link.dataset.packageChoice
      );
      if (option) packageSelect.value = option.value;
    });
  });
  bookingForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!bookingForm.reportValidity()) return;
    const date = new Date(`${dateInput.value}T12:00:00`);
    const dateLabel = new Intl.DateTimeFormat('en-GB', { dateStyle: 'long' }).format(date);
    const guests = document.querySelector('#tour-guests').value;
    const tour = document.body.dataset.tourName;
    const phone = document.body.dataset.whatsapp;
    const pageUrl = document.querySelector('link[rel="canonical"]')?.href || window.location.href;
    const packageChoice = packageSelect ? ` Package: ${packageSelect.value}.` : '';
    const message = `Hi! I would like to check availability for the ${tour} on ${dateLabel} for ${guests} ${guests === '1' ? 'adult' : 'adults'}.${packageChoice} Please confirm the pickup details and total price. ${pageUrl}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  });

  const photos = Array.from(document.querySelectorAll('.gallery-photo img'));
  const dialog = document.querySelector('#photo-dialog');
  const dialogImage = document.querySelector('#dialog-image');
  const photoCount = document.querySelector('#photo-count');
  let currentPhoto = 0;
  const showPhoto = (index) => {
    currentPhoto = (index + photos.length) % photos.length;
    dialogImage.src = photos[currentPhoto].src;
    dialogImage.alt = photos[currentPhoto].alt;
    photoCount.textContent = `${currentPhoto + 1} / ${photos.length}`;
  };
  document.querySelectorAll('.gallery-photo').forEach((button, index) => {
    button.addEventListener('click', () => {
      showPhoto(index);
      dialog.showModal();
    });
  });
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.querySelectorAll('[data-direction]').forEach((button) => {
    button.addEventListener('click', () => showPhoto(currentPhoto + Number(button.dataset.direction)));
  });
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') showPhoto(currentPhoto - 1);
    if (event.key === 'ArrowRight') showPhoto(currentPhoto + 1);
  });
})();
