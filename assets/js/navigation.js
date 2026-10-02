export function initializeActiveNavigation() {
  const primaryNavLinks = [...document.querySelectorAll(".primary-nav a[href^='#']")];
  let activeNavFrame = 0;

  function updateActiveNavigation() {
    const headerHeight = document.querySelector(".site-header").getBoundingClientRect().height;
    const activationLine = headerHeight + 48;
    let activeSectionId = null;

    primaryNavLinks.forEach((link) => {
      const section = document.querySelector(link.getAttribute("href"));
      const bounds = section.getBoundingClientRect();
      if (bounds.top <= activationLine && bounds.bottom > activationLine) {
        activeSectionId = section.id;
      }
    });

    primaryNavLinks.forEach((link) => {
      if (link.hash === `#${activeSectionId}`) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
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
