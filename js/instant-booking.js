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

  function updateBookingSummary(tour, travelers) {
    document.querySelectorAll("[data-tour-name]").forEach(function (node) {
      node.textContent = tour.name;
    });
    document.querySelector("[data-tour-tagline]").textContent = tour.tagline;
    document.querySelector("[data-tour-duration]").textContent = tour.duration;
    document.querySelector("[data-tour-pickup]").textContent = tour.pickup;
    document.querySelector("[data-tour-price]").textContent = formatPrice(tour.price, tour.currency);
    document.querySelector("[data-total]").textContent = formatPrice(tour.price * travelers, tour.currency);
    document.querySelector("[data-tour-link]").href = tour.pagePath;
  }

  function attachBookingPage() {
    const slug = params.get("tour");
    if (!slug) {
      window.location.href = "/";
      return;
    }

    const form = document.querySelector("[data-booking-form]");
    const travelerInput = document.querySelector("#travelers");
    const bookingDateInput = document.querySelector("#booking-date");
    const errorNode = document.querySelector("[data-booking-error]");
    const submitButton = document.querySelector("[data-booking-submit]");
    const fallbackLink = document.querySelector("[data-whatsapp-fallback]");

    const today = new Date();
    const minDate = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    bookingDateInput.min = minDate.toISOString().slice(0, 10);

    let selectedTour = null;

    try {
      const tour = getTourBySlug(slug);

      if (!tour) {
        throw new Error("This tour is not available for instant booking yet.");
      }

      selectedTour = tour;
      document.title = `Instant Booking | ${tour.name}`;
      fallbackLink.href =
        "https://wa.me/212700006462?text=" +
        encodeURIComponent(`Hi! I would like to book ${tour.name}.`);
      updateBookingSummary(tour, Number.parseInt(travelerInput.value, 10) || 1);
    } catch (error) {
      errorNode.textContent = error.message;
    }

    travelerInput.addEventListener("input", function () {
      if (selectedTour) {
        updateBookingSummary(selectedTour, Number.parseInt(travelerInput.value, 10) || 1);
      }
    });

    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      if (!selectedTour) {
        return;
      }

      errorNode.textContent = "";
      submitButton.disabled = true;
      submitButton.textContent = "Redirecting to secure payment...";

      const payload = {
        tourSlug: selectedTour.slug,
        bookingDate: bookingDateInput.value,
        travelers: travelerInput.value,
        customerName: document.querySelector("#customer-name").value.trim(),
        customerEmail: document.querySelector("#customer-email").value.trim(),
        customerPhone: document.querySelector("#customer-phone").value.trim(),
        hotelName: document.querySelector("#hotel-name").value.trim(),
        notes: document.querySelector("#booking-notes").value.trim()
      };

      try {
        const response = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Unable to start checkout.");
        }

        window.location.href = data.url;
      } catch (error) {
        submitButton.disabled = false;
        submitButton.textContent = "Pay securely with Stripe";
        errorNode.textContent = error.message;
      }
    });
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
        link.href = `/instant-booking.html?tour=${encodeURIComponent(slug)}`;
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
