(function () {
  const form = document.getElementById("timlaline-combo-booking");
  if (!form) return;

  const bookingLink = document.getElementById("combo-whatsapp-booking");
  const totalNode = document.getElementById("combo-total");
  const dateInput = form.elements.namedItem("date");
  dateInput.min = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

  function count(value, minimum) {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? Math.min(50, Math.max(minimum, parsed)) : minimum;
  }

  function updateBooking() {
    const adults = count(form.elements.namedItem("adults").value, 1);
    const children = count(form.elements.namedItem("children").value, 0);
    const date = dateInput.value;
    const pickup = form.elements.namedItem("pickup").value;
    const hotel = form.elements.namedItem("hotel").value.trim().replace(/\s+/g, " ");

    totalNode.textContent = `€${(adults * 80).toLocaleString("en-US")}`;

    const lines = [
      "Hi! I would like to inquire about the Timlaline Quad & Camel Ride with BBQ.",
      `Guests: ${adults} adult${adults === 1 ? "" : "s"}, ${children} child${children === 1 ? "" : "ren"}`,
      `Adult subtotal: €${adults * 80} (€80 per adult; please confirm child price and participation)`,
      `Preferred date: ${date || "Please ask me"}`,
      `Pickup area: ${pickup}`,
      `Hotel or accommodation: ${hotel || "I will confirm"}`,
      "Please confirm availability, exact pickup time, rider eligibility, and any child price.",
      "https://agadirlocalguide.com/tours/tour-timlaline-quad-camel-bbq-agadir.html"
    ];
    bookingLink.href = `https://wa.me/212700006467?text=${encodeURIComponent(lines.join("\n"))}`;
  }

  form.addEventListener("input", updateBooking);
  form.addEventListener("change", updateBooking);
  form.addEventListener("focusout", function (event) {
    if (event.target.name === "adults" || event.target.name === "children") {
      event.target.value = count(event.target.value, event.target.name === "adults" ? 1 : 0);
      updateBooking();
    }
  });
  updateBooking();
})();
