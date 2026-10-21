(function () {
  const path = window.location.pathname;
  const params = new URLSearchParams(window.location.search);
  const tours = Array.isArray(window.TOUR_DATA) ? window.TOUR_DATA : [];

  function formatPrice(value, currency) {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: (currency || "eur").toUpperCase()
    }).format(value);
  }

  function getTourBySlug(slug) {
    return tours.find((tour) => tour.slug === slug && tour.instantBooking) || null;
  }

  function attachBookingPage() {
    const slug = params.get("tour");
    const tour = getTourBySlug(slug);
    window.location.replace(tour ? tour.pagePath : "/all-tours.html");
  }

  function attachSuccessPage() {
    const sessionId = params.get("session_id");
    const statusNode = document.querySelector("[data-status-content]");

    if (!sessionId) {
      statusNode.innerHTML = "<p>We could not find your payment session.</p>";
      return;
    }

    fetch(`/api/checkout-session?session_id=${encodeURIComponent(sessionId)}`, {
      cache: "no-store"
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Unable to load booking details.");
        }

        const amount = formatPrice((data.amountTotal || 0) / 100, data.currency);
        statusNode.innerHTML = `
          <div class="booking-status-list">
            <div class="booking-status-item">
              <span class="booking-status-label">Tour</span>
              <span class="booking-status-value">${data.tourName}</span>
            </div>
            <div class="booking-status-item">
              <span class="booking-status-label">Date requested</span>
              <span class="booking-status-value">${data.bookingDate}</span>
            </div>
            <div class="booking-status-item">
              <span class="booking-status-label">Travelers</span>
              <span class="booking-status-value">${data.travelers}</span>
            </div>
            <div class="booking-status-item">
              <span class="booking-status-label">Paid</span>
              <span class="booking-status-value">${amount}</span>
            </div>
            <div class="booking-status-item">
              <span class="booking-status-label">Email</span>
              <span class="booking-status-value">${data.customerEmail || "-"}</span>
            </div>
          </div>
        `;
      })
      .catch((error) => {
        statusNode.innerHTML = `<p>${error.message}</p>`;
      });
  }

  function attachCancelledPage() {
    const slug = params.get("tour");
    const link = document.querySelector("[data-cancel-tour-link]");

    if (slug) {
      const tour = getTourBySlug(slug);

      if (tour) {
        link.href = tour.pagePath;
        link.textContent = `Return to ${tour.name}`;
      }
    }
  }

  if (path.endsWith("/instant-booking.html")) {
    attachBookingPage();
  } else if (path.endsWith("/booking-success.html")) {
    attachSuccessPage();
  } else if (path.endsWith("/booking-cancelled.html")) {
    attachCancelledPage();
  }
})();
