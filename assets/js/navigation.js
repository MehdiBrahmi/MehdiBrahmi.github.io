export function initializeActiveNavigation() {
  const primaryNavLinks = [...document.querySelectorAll(".primary-nav a[href^='#']")];
  const primaryNav = document.querySelector(".primary-nav");
  const languageLinks = [...document.querySelectorAll(".language-switch a[href]")];
  let activeNavFrame = 0;

  function updateActiveNavigation() {
    const header = document.querySelector(".site-header");
    const viewportTop = header.getBoundingClientRect().bottom;
    const viewportBottom = window.innerHeight;
    let activeSectionId = null;
    let largestVisibleRatio = 0;

    primaryNavLinks.forEach((link) => {
      const section = document.querySelector(link.getAttribute("href"));
      if (!section) {
        return;
      }
      const bounds = section.getBoundingClientRect();
      const visibleWidth = Math.max(0, Math.min(bounds.right, window.innerWidth) - Math.max(bounds.left, 0));
      const visibleHeight = Math.max(0, Math.min(bounds.bottom, viewportBottom) - Math.max(bounds.top, viewportTop));
      const sectionArea = bounds.width * bounds.height;
      const visibleRatio = sectionArea > 0 ? (visibleWidth * visibleHeight) / sectionArea : 0;

      if (visibleRatio > largestVisibleRatio) {
        largestVisibleRatio = visibleRatio;
        activeSectionId = section.id;
      }
    });

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
