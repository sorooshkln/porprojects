(() => {
  "use strict";
  const mobile = matchMedia("(max-width: 600px)");
  const drawer = document.querySelector("#mobile-menu-dialog");
  const menuButton = document.querySelector(".mobile-menu-toggle");
  const searchForm = document.querySelector(".search");
  const searchMarker = document.createComment("search desktop position");
  searchForm.before(searchMarker);
  const pagination = document.querySelector("#product-pagination");
  const paginationMarker = document.createComment(
    "pagination desktop position",
  );
  pagination.before(paginationMarker);
  const disclosureState = new Map();
  const disclosures = [...document.querySelectorAll(".footer-disclosure")];
  function syncDisclosure(button) {
    const open = !mobile.matches || disclosureState.get(button) === true;
    button.disabled = !mobile.matches;
    button.setAttribute("aria-expanded", String(open));
    document.getElementById(button.getAttribute("aria-controls")).hidden =
      !open;
  }
  function closeDrawer() {
    if (drawer.open) drawer.close();
    menuButton.setAttribute("aria-expanded", "false");
  }
  function syncLayout() {
    if (mobile.matches) {
      drawer.querySelector(".mobile-menu-search").append(searchForm);
      document.querySelector(".latest-motion-tools").prepend(pagination);
    } else {
      closeDrawer();
      searchMarker.after(searchForm);
      paginationMarker.after(pagination);
    }
    disclosures.forEach(syncDisclosure);
  }
  menuButton.addEventListener("click", () => {
    document.querySelector(".mobile-cart-count").textContent =
      document.querySelector("#cart-count").textContent;
    drawer.showModal();
    menuButton.setAttribute("aria-expanded", "true");
    // Avoid opening the software keyboard until the user selects search.
    drawer.querySelector(".mobile-menu-close").focus();
  });
  drawer
    .querySelector(".mobile-menu-close")
    .addEventListener("click", closeDrawer);
  drawer.addEventListener("close", () =>
    menuButton.setAttribute("aria-expanded", "false"),
  );
  drawer.addEventListener(
    "click",
    (event) => {
      const action = event.target.closest("nav button,nav a");
      if (action) closeDrawer();
      else if (event.target === drawer) {
        const box = drawer.getBoundingClientRect();
        if (
          event.clientX < box.left ||
          event.clientX > box.right ||
          event.clientY < box.top ||
          event.clientY > box.bottom
        )
          closeDrawer();
      }
    },
    true,
  );
  searchForm.addEventListener("submit", closeDrawer);
  document
    .querySelector(".announcement-close")
    .addEventListener("click", () => {
      document.querySelector(".announcement").hidden = true;
    });
  disclosures.forEach((button) =>
    button.addEventListener("click", () => {
      if (!mobile.matches) return;
      disclosureState.set(button, !disclosureState.get(button));
      syncDisclosure(button);
    }),
  );
  mobile.addEventListener("change", syncLayout);
  syncLayout();
})();
