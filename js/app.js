const menuBtn =
  document.getElementById("menuBtn");

const navMenu =
  document.getElementById("navMenu");

if (menuBtn && navMenu) {

  menuBtn.addEventListener(
    "click",
    () => {

      navMenu.classList.toggle(
        "active"
      );

    }
  );

}


document
  .querySelectorAll("#navMenu a")
  .forEach(link => {

    link.addEventListener(
      "click",
      () => {

        if (navMenu) {

          navMenu.classList.remove(
            "active"
          );

        }

      }
    );

  });


const searchInput =
  document.getElementById(
    "searchInput"
  );

const categoryFilter =
  document.getElementById(
    "categoryFilter"
  );


function filterOpportunities() {

  const cards =
    document.querySelectorAll(
      ".opportunity-card"
    );

  const keyword =
    searchInput
      ? searchInput.value
          .toLowerCase()
          .trim()
      : "";

  const category =
    categoryFilter
      ? categoryFilter.value
      : "all";

  cards.forEach(card => {

    const text =
      card.innerText.toLowerCase();

    const cardCategory =
      card.dataset.category || "";

    const matchesSearch =
      text.includes(keyword);

    const matchesCategory =
      category === "all" ||
      cardCategory.includes(
        category.toLowerCase()
      );

    card.classList.toggle(
      "hidden",
      !(
        matchesSearch &&
        matchesCategory
      )
    );

  });

}


if (searchInput) {

  searchInput.addEventListener(
    "input",
    filterOpportunities
  );

}


if (categoryFilter) {

  categoryFilter.addEventListener(
    "change",
    filterOpportunities
  );

}


const yearElement =
  document.getElementById("year");

if (yearElement) {

  yearElement.textContent =
    new Date().getFullYear();

}


/* ==========================================================
   MARKETPLACE DROPDOWN NAVIGATION
========================================================== */

const marketplaceDropdowns =
  document.querySelectorAll(
    ".nav-dropdown"
  );

marketplaceDropdowns.forEach(
  dropdown => {

    const toggle =
      dropdown.querySelector(
        ".nav-dropdown-toggle"
      );

    if (!toggle) return;

    toggle.addEventListener(
      "click",
      event => {

        event.stopPropagation();

        const willOpen =
          !dropdown.classList
            .contains("open");

        marketplaceDropdowns
          .forEach(item => {

            item.classList.remove(
              "open"
            );

            const itemToggle =
              item.querySelector(
                ".nav-dropdown-toggle"
              );

            if (itemToggle) {
              itemToggle.setAttribute(
                "aria-expanded",
                "false"
              );
            }

          });

        if (willOpen) {

          dropdown.classList.add(
            "open"
          );

          toggle.setAttribute(
            "aria-expanded",
            "true"
          );

        }

      }
    );

  }
);


document.addEventListener(
  "click",
  event => {

    if (
      !event.target.closest(
        ".nav-dropdown"
      )
    ) {

      marketplaceDropdowns
        .forEach(dropdown => {

          dropdown.classList.remove(
            "open"
          );

          const toggle =
            dropdown.querySelector(
              ".nav-dropdown-toggle"
            );

          if (toggle) {

            toggle.setAttribute(
              "aria-expanded",
              "false"
            );

          }

        });

    }

  }
);


/* ==========================================================
   CATEGORY FILTER LINKS
========================================================== */

document
  .querySelectorAll(
    "[data-filter-link]"
  )
  .forEach(link => {

    link.addEventListener(
      "click",
      function() {

        const filter =
          this.dataset.filterLink;

        marketplaceDropdowns
          .forEach(dropdown => {

            dropdown.classList.remove(
              "open"
            );

          });

        setTimeout(() => {

          const cards =
            document.querySelectorAll(
              ".opportunity-card"
            );

          cards.forEach(card => {

            if (
              filter === "all"
            ) {

              card.classList.remove(
                "hidden"
              );

              return;

            }

            const searchable =
              (
                card.innerText +
                " " +
                (
                  card.dataset.category ||
                  ""
                )
              ).toLowerCase();

            card.classList.toggle(
              "hidden",
              !searchable.includes(
                filter.toLowerCase()
              )
            );

          });

        }, 250);

      }
    );

  });


const showAllCategoriesBtn =
  document.getElementById(
    "showAllCategoriesBtn"
  );

if (showAllCategoriesBtn) {

  showAllCategoriesBtn
    .addEventListener(
      "click",
      function() {

        const firstDropdown =
          document.querySelector(
            ".nav-dropdown"
          );

        if (firstDropdown) {

          firstDropdown.classList.add(
            "open"
          );

          window.scrollTo({
            top: 0,
            behavior: "smooth"
          });

        }

      }
    );

}
