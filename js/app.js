const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const cards = document.querySelectorAll(".opportunity-card");

menuBtn.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});

document.querySelectorAll("#navMenu a").forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
  });
});

function filterOpportunities() {
  const keyword = searchInput.value.toLowerCase();
  const category = categoryFilter.value;

  cards.forEach(card => {
    const text = card.innerText.toLowerCase();
    const cardCategory = card.dataset.category;

    const matchesSearch = text.includes(keyword);
    const matchesCategory =
      category === "all" || cardCategory === category;

    card.classList.toggle(
      "hidden",
      !(matchesSearch && matchesCategory)
    );
  });
}

searchInput.addEventListener("input", filterOpportunities);
categoryFilter.addEventListener("change", filterOpportunities);

document.getElementById("year").textContent =
  new Date().getFullYear();
