export function initializeActiveNavigation() {
  const primaryNavLinks = [...document.querySelectorAll(".primary-nav a[href^='#']")];
  const primaryNav = document.querySelector(".primary-nav");
  const languageLinks = [...document.querySelectorAll(".language-switch a[href]")];
  let activeNavFrame = 0;

  function updateActiveNavigation() {
    const headerHeight = document.querySelector(".site-header").getBoundingClientRect().height;
    const activationLine = headerHeight + 48;
    let activeSectionId = null;
    let lastVisibleSectionId = null;

    primaryNavLinks.forEach((link) => {
      const section = document.querySelector(link.getAttribute("href"));
      const bounds = section.getBoundingClientRect();
      const headingBounds = section.querySelector("h2").getBoundingClientRect();
      if (bounds.top <= activationLine && bounds.bottom > activationLine) {
        activeSectionId = section.id;
      }
      if (headingBounds.top < window.innerHeight && headingBounds.bottom > headerHeight) {
        lastVisibleSectionId = section.id;
      }
    });

    activeSectionId = lastVisibleSectionId || activeSectionId;

    if (!activeSectionId && primaryNavLinks.some((link) => link.hash === window.location.hash)) {
      activeSectionId = window.location.hash.slice(1);
    }

    primaryNavLinks.forEach((link) => {
      if (link.hash === `#${activeSectionId}`) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    const activeLink = primaryNavLinks.find((link) => link.hash === `#${activeSectionId}`);
    if (activeLink) {
      const navBounds = primaryNav.getBoundingClientRect();
      const linkBounds = activeLink.getBoundingClientRect();
      primaryNav.style.setProperty("--nav-indicator-x", `${linkBounds.left - navBounds.left}px`);
      primaryNav.style.setProperty("--nav-indicator-width", `${linkBounds.width}px`);
      primaryNav.dataset.active = "true";
    } else {
      primaryNav.dataset.active = "false";
    }

    languageLinks.forEach((link) => {
      const languageUrl = new URL(link.href);
      languageUrl.hash = activeSectionId ? `#${activeSectionId}` : "";
      link.href = `${languageUrl.pathname}${languageUrl.search}${languageUrl.hash}`;
    });
  }

  function scheduleActiveNavigationUpdate() {
    if (activeNavFrame) {
      return;
    }
    activeNavFrame = window.requestAnimationFrame(() => {
      activeNavFrame = 0;
      updateActiveNavigation();
    });
  }

  window.addEventListener("scroll", scheduleActiveNavigationUpdate, { passive: true });
  window.addEventListener("resize", scheduleActiveNavigationUpdate);
  scheduleActiveNavigationUpdate();
}
