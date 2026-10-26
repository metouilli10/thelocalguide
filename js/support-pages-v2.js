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

  const search = document.querySelector("#faq-search");
  if (search) {
    const groups = [...document.querySelectorAll(".faq-group")];
    const items = [...document.querySelectorAll(".faq-item")];
    const results = document.querySelector("#faq-results");
    const empty = document.querySelector("#faq-empty");
    const filter = () => {
      const query = search.value.trim().toLocaleLowerCase();
      let count = 0;
      items.forEach((item) => {
        const matches = item.textContent.toLocaleLowerCase().includes(query);
        item.hidden = !matches;
        if (matches) count += 1;
      });
      groups.forEach((group) => {
        group.hidden = !group.querySelector(".faq-item:not([hidden])");
      });
      results.textContent = query
        ? `${count} ${count === 1 ? "answer" : "answers"} found`
        : `${items.length} questions answered`;
      empty.hidden = count !== 0;
    };
    search.addEventListener("input", filter);
    filter();
  }

  const tocLinks = [...document.querySelectorAll(".legal-toc a")];
  if (tocLinks.length && "IntersectionObserver" in window) {
    const sections = tocLinks
      .map((link) => document.querySelector(link.hash))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          )[0];
        if (!visible) return;
        tocLinks.forEach((link) =>
          link.classList.toggle(
            "is-active",
            link.hash === `#${visible.target.id}`,
          ),
        );
      },
      { rootMargin: "-15% 0px -65% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
  }
})();
