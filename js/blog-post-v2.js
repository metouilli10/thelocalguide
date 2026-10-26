/* Shared interactions for ALG long-form travel guides. */
(() => {
  const article = document.querySelector(".post-article");
  if (!article) return;

  const toc = document.querySelector("#post-toc");
  const headings = [...article.querySelectorAll(".post-prose h2")];
  const usedIds = new Set(
    [...document.querySelectorAll("[id]")].map((element) => element.id),
  );
  headings.forEach((heading, index) => {
    if (heading.id) return;
    const base =
      heading.textContent
        .trim()
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || `section-${index + 1}`;
    let id = base;
    let suffix = 2;
    while (usedIds.has(id)) id = `${base}-${suffix++}`;
    heading.id = id;
    usedIds.add(id);
  });
  if (toc) {
    headings.forEach((heading) => {
      const link = document.createElement("a");
      link.href = `#${heading.id}`;
      link.textContent = heading.textContent.trim();
      toc.append(link);
    });
    if (!headings.length)
      toc
        .closest(".post-sidebar")
        ?.querySelector(".post-sidebar__label")
        ?.remove();
  }

  const progress = document.querySelector(".post-progress");
  const updateProgress = () => {
    if (!progress) return;
    const top = article.getBoundingClientRect().top + window.scrollY;
    const end = top + article.offsetHeight - window.innerHeight;
    const fraction =
      end > top
        ? Math.min(1, Math.max(0, (window.scrollY - top) / (end - top)))
        : 1;
    progress.style.transform = `scaleX(${fraction})`;
  };
  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);

  if (toc && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          toc.querySelectorAll("a").forEach((link) => {
            const current = link.hash === `#${entry.target.id}`;
            link.classList.toggle("is-current", current);
            if (current) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
          });
        }
      },
      { rootMargin: "-18% 0px -70% 0px" },
    );
    headings.forEach((heading) => observer.observe(heading));
  }

  const copy = document.querySelector(".post-copy");
  copy?.addEventListener("click", async () => {
    const url =
      document.querySelector('link[rel="canonical"]')?.href || location.href;
    try {
      await navigator.clipboard.writeText(url);
      copy.setAttribute("aria-label", "Link copied");
      copy.innerHTML = '<i class="bi bi-check2" aria-hidden="true"></i>';
      setTimeout(() => {
        copy.setAttribute("aria-label", "Copy article link");
        copy.innerHTML = '<i class="bi bi-link-45deg" aria-hidden="true"></i>';
      }, 2200);
    } catch {
      window.prompt("Copy this link:", url);
    }
  });
})();
