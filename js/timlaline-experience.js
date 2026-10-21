(function () {
  const form = document.getElementById("timlaline-booking");
  if (!form) return;

  const packages = {
    morning: { label: "Morning Explorer (09:00–13:30)", adult: 35, child: 20 },
    sunset: { label: "Sunset & BBQ (typically 15:00–20:00; timing confirmed seasonally)", adult: 50, child: 35 }
  };
  const rideLabels = {
    none: "Included bus transfer from Ranch Tamri to Timlaline and back",
    quad: "Quad bike round trip from Ranch Tamri to Timlaline — please quote",
    buggy: "Buggy round trip from Ranch Tamri to Timlaline — please quote",
    camel: "Camel ride round trip from Ranch Tamri to Timlaline — please quote"
  };
  const bookingLink = document.getElementById("whatsapp-booking");
  const totalNode = document.getElementById("base-total");
  const dateInput = form.elements.namedItem("date");
  dateInput.min = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

  function count(value, minimum) {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? Math.min(50, Math.max(minimum, parsed)) : minimum;
  }

  function updateBooking() {
    const selectedPackage = form.querySelector('input[name="package"]:checked')?.value || "morning";
    const offer = packages[selectedPackage] || packages.morning;
    const adultsInput = form.elements.namedItem("adults");
    const childrenInput = form.elements.namedItem("children");
    const adults = count(adultsInput.value, 1);
    const children = count(childrenInput.value, 0);
    const ride = form.elements.namedItem("ride").value;
    const date = form.elements.namedItem("date").value;
    const hotel = form.elements.namedItem("hotel").value.trim().replace(/\s+/g, " ");
    const baseTotal = adults * offer.adult + children * offer.child;

    totalNode.textContent = `€${baseTotal.toLocaleString("en-US")}`;

    const lines = [
      "Hi! I would like to inquire about the Timlaline Experience.",
      `Package: ${offer.label}`,
      `Guests: ${adults} adult${adults === 1 ? "" : "s"}, ${children} child${children === 1 ? "" : "ren"} under 12`,
      `Base package estimate: €${baseTotal} (€${offer.adult} per adult; €${offer.child} per child under 12)`,
      `Travel to Timlaline: ${rideLabels[ride] || rideLabels.none}`,
      `Preferred date: ${date || "Please ask me"}`,
      `Agadir hotel: ${hotel || "I will confirm"}`,
      "Please confirm availability, exact pickup time, and any optional ride price and eligibility.",
      "https://agadirlocalguide.com/tours/tour-timlaline-experience-agadir.html"
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
  document.querySelectorAll("[data-package-choice]").forEach(function (link) {
    link.addEventListener("click", function () {
      const radio = form.querySelector(`input[name="package"][value="${link.dataset.packageChoice}"]`);
      if (radio) {
        radio.checked = true;
        updateBooking();
      }
    });
  });
  updateBooking();
})();
