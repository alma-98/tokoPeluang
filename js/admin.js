const STORAGE_KEY = "tokopeluang_opportunities";
const SESSION_KEY = "tokopeluang_admin_session";
const ADMIN_PIN = "1234";

const defaultOpportunities = [
  {
    id: 1,
    title: "Pembuatan Website Bisnis",
    category: "IT & Software",
    location: "Indonesia",
    budget: "Menyesuaikan",
    status: "active",
    description: "Mencari developer atau mitra untuk pengembangan website bisnis dan perusahaan.",
    requirements: "Memiliki portofolio\nMampu mengembangkan website responsive\nMemberikan penawaran harga",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Vendor Instalasi CCTV",
    category: "CCTV & Security",
    location: "Jawa Barat",
    budget: "Menyesuaikan proyek",
    status: "active",
    description: "Peluang kerja sama untuk vendor CCTV, jaringan, dan sistem keamanan.",
    requirements: "Pengadaan perangkat CCTV\nInstalasi dan konfigurasi\nMaintenance dan dukungan teknis",
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    title: "Kendaraan Operasional Perusahaan",
    category: "Otomotif",
    location: "Jabodetabek",
    budget: "Sesuai kebutuhan unit",
    status: "active",
    description: "Solusi kebutuhan kendaraan operasional untuk perusahaan dan pemilik usaha.",
    requirements: "Perusahaan atau pemilik usaha\nMemiliki kebutuhan kendaraan operasional",
    createdAt: new Date().toISOString()
  }
];

function getOpportunities() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(defaultOpportunities)
    );

    return defaultOpportunities;
  }

  return JSON.parse(saved);
}

function saveOpportunities(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const adminLogin = document.getElementById("adminLogin");
const adminApp = document.getElementById("adminApp");
const loginForm = document.getElementById("loginForm");
const adminPin = document.getElementById("adminPin");
const loginError = document.getElementById("loginError");
const logoutBtn = document.getElementById("logoutBtn");

function showAdmin() {
  adminLogin.classList.add("hidden");
  adminApp.classList.remove("hidden");
  renderAll();
}

function showLogin() {
  adminLogin.classList.remove("hidden");
  adminApp.classList.add("hidden");
}

if (sessionStorage.getItem(SESSION_KEY) === "active") {
  showAdmin();
} else {
  showLogin();
}

loginForm.addEventListener("submit", function(event) {
  event.preventDefault();

  if (adminPin.value === ADMIN_PIN) {
    sessionStorage.setItem(SESSION_KEY, "active");
    loginError.textContent = "";
    adminPin.value = "";
    showAdmin();
  } else {
    loginError.textContent = "PIN admin tidak sesuai.";
  }
});

logoutBtn.addEventListener("click", function() {
  sessionStorage.removeItem(SESSION_KEY);
  showLogin();
});

const navButtons = document.querySelectorAll(
  ".admin-nav-item[data-section]"
);

const sections = {
  dashboard: document.getElementById("dashboardSection"),
  opportunities: document.getElementById("opportunitiesSection"),
  add: document.getElementById("addSection")
};

const pageTitle = document.getElementById("pageTitle");

function showSection(sectionName) {
  Object.values(sections).forEach(section => {
    section.classList.remove("active-section");
  });

  navButtons.forEach(button => {
    button.classList.remove("active");
  });

  sections[sectionName].classList.add("active-section");

  const activeButton = document.querySelector(
    `[data-section="${sectionName}"]`
  );

  if (activeButton) {
    activeButton.classList.add("active");
  }

  const titles = {
    dashboard: "Dashboard",
    opportunities: "Kelola Peluang",
    add: "Tambah Peluang"
  };

  pageTitle.textContent = titles[sectionName];

  document
    .querySelector(".admin-sidebar")
    .classList.remove("mobile-open");
}

navButtons.forEach(button => {
  button.addEventListener("click", function() {
    showSection(this.dataset.section);
  });
});

document.querySelectorAll(".go-add-btn").forEach(button => {
  button.addEventListener("click", function() {
    resetForm();
    showSection("add");
  });
});

document
  .querySelector(".go-opportunities-btn")
  .addEventListener("click", function() {
    showSection("opportunities");
  });

document
  .getElementById("mobileSidebarBtn")
  .addEventListener("click", function() {
    document
      .querySelector(".admin-sidebar")
      .classList.toggle("mobile-open");
  });

const opportunityForm =
  document.getElementById("adminOpportunityForm");

const editOpportunityId =
  document.getElementById("editOpportunityId");

const adminTitle =
  document.getElementById("adminTitle");

const adminCategory =
  document.getElementById("adminCategory");

const adminLocation =
  document.getElementById("adminLocation");

const adminBudget =
  document.getElementById("adminBudget");

const adminStatus =
  document.getElementById("adminStatus");

const adminDescription =
  document.getElementById("adminDescription");

const adminRequirements =
  document.getElementById("adminRequirements");

const cancelEditBtn =
  document.getElementById("cancelEditBtn");

const formModeLabel =
  document.getElementById("formModeLabel");

const formTitle =
  document.getElementById("formTitle");

opportunityForm.addEventListener("submit", function(event) {
  event.preventDefault();

  let opportunities = getOpportunities();

  const data = {
    title: adminTitle.value.trim(),
    category: adminCategory.value,
    location: adminLocation.value.trim(),
    budget: adminBudget.value.trim() || "Tidak disebutkan",
    status: adminStatus.value,
    description: adminDescription.value.trim(),
    requirements: adminRequirements.value.trim()
  };

  if (editOpportunityId.value) {
    const id = Number(editOpportunityId.value);

    opportunities = opportunities.map(item => {
      if (item.id === id) {
        return {
          ...item,
          ...data,
          updatedAt: new Date().toISOString()
        };
      }

      return item;
    });

    alert("Peluang berhasil diperbarui.");
  } else {
    opportunities.unshift({
      id: Date.now(),
      ...data,
      createdAt: new Date().toISOString()
    });

    alert("Peluang baru berhasil ditambahkan.");
  }

  saveOpportunities(opportunities);
  resetForm();
  renderAll();
  showSection("opportunities");
});

function resetForm() {
  opportunityForm.reset();
  editOpportunityId.value = "";
  adminStatus.value = "active";
  formModeLabel.textContent = "PELUANG BARU";
  formTitle.textContent = "Tambah Peluang";
  cancelEditBtn.classList.add("hidden");
}

cancelEditBtn.addEventListener("click", function() {
  resetForm();
  showSection("opportunities");
});

window.editOpportunity = function(id) {
  const opportunities = getOpportunities();

  const item = opportunities.find(
    opportunity => opportunity.id === id
  );

  if (!item) return;

  editOpportunityId.value = item.id;
  adminTitle.value = item.title;
  adminCategory.value = item.category;
  adminLocation.value = item.location;
  adminBudget.value = item.budget;
  adminStatus.value = item.status;
  adminDescription.value = item.description;
  adminRequirements.value = item.requirements || "";

  formModeLabel.textContent = "EDIT DATA";
  formTitle.textContent = "Edit Peluang";
  cancelEditBtn.classList.remove("hidden");

  showSection("add");
};

window.deleteOpportunity = function(id) {
  const confirmed = confirm(
    "Apakah Anda yakin ingin menghapus peluang ini?"
  );

  if (!confirmed) return;

  const opportunities = getOpportunities().filter(
    item => item.id !== id
  );

  saveOpportunities(opportunities);
  renderAll();
};

window.toggleOpportunity = function(id) {
  const opportunities = getOpportunities().map(item => {
    if (item.id === id) {
      return {
        ...item,
        status:
          item.status === "active"
            ? "closed"
            : "active"
      };
    }

    return item;
  });

  saveOpportunities(opportunities);
  renderAll();
};

function createTable(data) {
  if (!data.length) {
    return `
      <div class="empty-state">
        <strong>Belum ada data.</strong>
        Tambahkan peluang baru dari Dashboard Admin.
      </div>
    `;
  }

  return `
    <div class="admin-table-wrapper">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Peluang</th>
            <th>Kategori</th>
            <th>Lokasi</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          ${data.map(item => `
            <tr>
              <td class="table-title">
                <strong>${escapeHTML(item.title)}</strong>
                <small>${escapeHTML(item.budget)}</small>
              </td>

              <td>${escapeHTML(item.category)}</td>

              <td>${escapeHTML(item.location)}</td>

              <td>
                <span class="status-badge ${
                  item.status === "active"
                    ? "status-active"
                    : "status-closed"
                }">
                  ${
                    item.status === "active"
                      ? "AKTIF"
                      : "DITUTUP"
                  }
                </span>
              </td>

              <td>
                <div class="table-actions">
                  <button
                    class="table-action-btn"
                    onclick="editOpportunity(${item.id})"
                  >
                    Edit
                  </button>

                  <button
                    class="table-action-btn"
                    onclick="toggleOpportunity(${item.id})"
                  >
                    ${
                      item.status === "active"
                        ? "Tutup"
                        : "Buka"
                    }
                  </button>

                  <button
                    class="table-action-btn delete-btn"
                    onclick="deleteOpportunity(${item.id})"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderDashboard() {
  const opportunities = getOpportunities();

  const active = opportunities.filter(
    item => item.status === "active"
  );

  const closed = opportunities.filter(
    item => item.status === "closed"
  );

  const categories = new Set(
    opportunities.map(item => item.category)
  );

  document.getElementById(
    "totalOpportunities"
  ).textContent = opportunities.length;

  document.getElementById(
    "activeOpportunities"
  ).textContent = active.length;

  document.getElementById(
    "closedOpportunities"
  ).textContent = closed.length;

  document.getElementById(
    "totalCategories"
  ).textContent = categories.size;

  document.getElementById(
    "recentOpportunities"
  ).innerHTML = createTable(
    opportunities.slice(0, 5)
  );
}

const adminSearch =
  document.getElementById("adminSearch");

const adminStatusFilter =
  document.getElementById("adminStatusFilter");

function renderOpportunityTable() {
  const keyword =
    adminSearch.value.toLowerCase().trim();

  const status =
    adminStatusFilter.value;

  const opportunities = getOpportunities().filter(item => {
    const searchable = `
      ${item.title}
      ${item.category}
      ${item.location}
      ${item.description}
    `.toLowerCase();

    const matchesKeyword =
      searchable.includes(keyword);

    const matchesStatus =
      status === "all" ||
      item.status === status;

    return matchesKeyword && matchesStatus;
  });

  document.getElementById(
    "opportunityTable"
  ).innerHTML = createTable(opportunities);
}

adminSearch.addEventListener(
  "input",
  renderOpportunityTable
);

adminStatusFilter.addEventListener(
  "change",
  renderOpportunityTable
);

function renderAll() {
  renderDashboard();
  renderOpportunityTable();
}

function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

renderAll();
