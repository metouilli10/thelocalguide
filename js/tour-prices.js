(function () {
  const tours = Array.isArray(window.TOUR_DATA) ? window.TOUR_DATA : [];

  if (!tours.length) {
    return;
  }

  function normalizePathname(pathname) {
    if (!pathname) {
      return "";
    }

    let normalized = pathname.trim();

    if (/^https?:\/\//i.test(normalized)) {
      normalized = new URL(normalized).pathname;
    }

    if (!normalized.startsWith("/")) {
      normalized = `/${normalized}`;
    }

    return normalized.replace(/\/+$/, "") || "/";
  }

  function buildTourPathMap(items) {
    const map = new Map();

    items.forEach(function (tour) {
      [tour.pagePath].concat(tour.aliases || []).forEach(function (pathname) {
        map.set(normalizePathname(pathname), tour);
      });
    });

    return map;
  }

  function formatPriceText(price, currentText) {
    const trimmed = (currentText || "").replace(/\s+/g, " ").trim();
    const prefix = /^from\b/i.test(trimmed) ? "From " : "";
    return `${prefix}€${price}`;
  }

  function updateCurrentTourBookingPrice(tourByPath) {
    const currentTour = tourByPath.get(normalizePathname(window.location.pathname));

    if (!currentTour) {
      return;
    }

    document.querySelectorAll(".booking-column .price-amount").forEach(function (node) {
      node.textContent = formatPriceText(currentTour.price, node.textContent);
    });
  }

  function findTourForPriceNode(node, tourByPath) {
    const anchor = node.closest("a[href]") || node.parentElement?.querySelector?.("a[href]");

    if (!anchor) {
      return null;
    }

    const href = anchor.getAttribute("href");

    if (!href || href.startsWith("#") || href.startsWith("javascript:")) {
      return null;
    }

    const pathname = normalizePathname(new URL(href, window.location.href).pathname);
    return tourByPath.get(pathname) || null;
  }

  function updateLinkedTourPrices(tourByPath) {
    document
      .querySelectorAll(".trip-card__price, .tour-card-price, .tour-price")
      .forEach(function (node) {
        const tour = findTourForPriceNode(node, tourByPath);

        if (!tour) {
          return;
        }

        node.textContent = formatPriceText(tour.price, node.textContent);
      });
  }

  const tourByPath = buildTourPathMap(tours);
  updateCurrentTourBookingPrice(tourByPath);
  updateLinkedTourPrices(tourByPath);
})();
