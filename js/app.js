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
