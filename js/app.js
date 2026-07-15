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


/* ==========================================================
   OPPORTUNITY TYPE FILTER
========================================================== */

const opportunityTypeButtons =
  document.querySelectorAll(
    ".opportunity-type-btn"
  );

let activeOpportunityType =
  "all";


function applyOpportunityTypeFilter() {

  const cards =
    document.querySelectorAll(
      ".opportunity-card"
    );

  const keyword =
    document.getElementById(
      "searchInput"
    )
      ?.value
      .toLowerCase()
      .trim() || "";

  const category =
    document.getElementById(
      "categoryFilter"
    )
      ?.value || "all";

  cards.forEach(card => {

    const searchable = (
      card.innerText +
      " " +
      (
        card.dataset.category ||
        ""
      ) +
      " " +
      (
        card.dataset.type ||
        ""
      )
    ).toLowerCase();

    const matchesKeyword =
      searchable.includes(keyword);

    const matchesCategory =
      category === "all" ||
      searchable.includes(
        category.toLowerCase()
      );

    const matchesType =
      activeOpportunityType === "all" ||
      searchable.includes(
        activeOpportunityType
          .toLowerCase()
      );

    card.classList.toggle(
      "hidden",
      !(
        matchesKeyword &&
        matchesCategory &&
        matchesType
      )
    );

  });

}


opportunityTypeButtons.forEach(
  button => {

    button.addEventListener(
      "click",
      function() {

        opportunityTypeButtons
          .forEach(item => {

            item.classList.remove(
              "active"
            );

          });

        this.classList.add(
          "active"
        );

        activeOpportunityType =
          this.dataset.typeFilter;

        applyOpportunityTypeFilter();

      }
    );

  }
);


const opportunitySearchInput =
  document.getElementById(
    "searchInput"
  );

if (opportunitySearchInput) {

  opportunitySearchInput
    .addEventListener(
      "input",
      applyOpportunityTypeFilter
    );

}


const opportunityCategoryFilter =
  document.getElementById(
    "categoryFilter"
  );

if (opportunityCategoryFilter) {

  opportunityCategoryFilter
    .addEventListener(
      "change",
      applyOpportunityTypeFilter
    );

}


/* ==========================================================
   UMKM SUBCATEGORY FILTER
========================================================== */

const opportunityFilterDropdowns =
  document.querySelectorAll(
    ".opportunity-filter-dropdown"
  );

opportunityFilterDropdowns.forEach(
  dropdown => {

    const toggle =
      dropdown.querySelector(
        ".opportunity-filter-toggle"
      );

    const menuButtons =
      dropdown.querySelectorAll(
        ".opportunity-filter-menu [data-type-filter]"
      );

    if (!toggle) return;

    toggle.addEventListener(
      "click",
      event => {

        event.stopPropagation();

        const isOpen =
          dropdown.classList
            .contains("open");

        opportunityFilterDropdowns
          .forEach(item =>
            item.classList.remove("open")
          );

        if (!isOpen) {
          dropdown.classList.add("open");

          toggle.setAttribute(
            "aria-expanded",
            "true"
          );
        }

      }
    );

    menuButtons.forEach(
      button => {

        button.addEventListener(
          "click",
          function() {

            const selectedType =
              this.dataset.typeFilter;

            activeOpportunityType =
              selectedType;

            document
              .querySelectorAll(
                ".opportunity-type-btn"
              )
              .forEach(item =>
                item.classList.remove(
                  "active"
                )
              );

            menuButtons.forEach(
              item =>
                item.classList.remove(
                  "active"
                )
            );

            this.classList.add(
              "active"
            );

            toggle.classList.add(
              "active"
            );

            if (
              selectedType === "umkm"
            ) {

              toggle.childNodes[0]
                .textContent =
                "UMKM ";

            } else {

              const selectedLabel =
                this.textContent.trim();

              toggle.childNodes[0]
                .textContent =
                selectedLabel + " ";

            }

            dropdown.classList.remove(
              "open"
            );

            toggle.setAttribute(
              "aria-expanded",
              "false"
            );

            applyOpportunityTypeFilter();

          }
        );

      }
    );

  }
);


document.addEventListener(
  "click",
  event => {

    if (
      !event.target.closest(
        ".opportunity-filter-dropdown"
      )
    ) {

      opportunityFilterDropdowns
        .forEach(dropdown => {

          dropdown.classList.remove(
            "open"
          );

          const toggle =
            dropdown.querySelector(
              ".opportunity-filter-toggle"
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
