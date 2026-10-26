(() => {
  const menuButton = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  menuButton?.addEventListener("click", () => {
    const opened = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(opened));
    menuButton.setAttribute("aria-label", opened ? "Close menu" : "Open menu");
    mobileNav.hidden = !opened;
  });
  mobileNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.hidden = true;
      menuButton?.setAttribute("aria-expanded", "false");
      menuButton?.setAttribute("aria-label", "Open menu");
    });
  });

  const form = document.querySelector("#contact-form");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const fields = new FormData(form);
    const name = String(fields.get("name") || "").trim();
    const interest = String(fields.get("interest") || "General question");
    const subject = `Agadir Local Guide inquiry — ${interest}`;
    const body = [
      `Name: ${name}`,
      `Email: ${String(fields.get("email") || "").trim()}`,
      `Phone: ${String(fields.get("phone") || "").trim() || "Not provided"}`,
      `Interested in: ${interest}`,
      "",
      String(fields.get("message") || "").trim(),
    ].join("\n");
    window.location.href = `mailto:agadirlocalguide@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
})();
