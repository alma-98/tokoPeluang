const OPPORTUNITY_STORAGE_KEY =
  "tokopeluang_opportunities";

const supabaseConfig =
  window.TOKOPELUANG_SUPABASE;

const adminSupabase =
  window.supabase.createClient(
    supabaseConfig.url,
    supabaseConfig.key
  );

const ADMIN_EMAIL =
  "alma.budsteddy88@gmail.com";


/* =========================================
   DEFAULT OPPORTUNITIES
========================================= */

const defaultOpportunities = [
  {
    id: 1,
    title: "Pembuatan Website Bisnis",
    category: "IT & Software",
    location: "Indonesia",
    budget: "Menyesuaikan",
    status: "active",
    description:
      "Mencari developer atau mitra untuk pengembangan website bisnis dan perusahaan.",
    requirements:
      "Memiliki portofolio\nMampu mengembangkan website responsive\nMemberikan penawaran harga",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Vendor Instalasi CCTV",
    category: "CCTV & Security",
    location: "Jawa Barat",
    budget: "Menyesuaikan proyek",
    status: "active",
    description:
      "Peluang kerja sama untuk vendor CCTV, jaringan, dan sistem keamanan.",
    requirements:
      "Pengadaan perangkat CCTV\nInstalasi dan konfigurasi\nMaintenance dan dukungan teknis",
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    title: "Kendaraan Operasional Perusahaan",
    category: "Otomotif",
    location: "Jabodetabek",
    budget: "Sesuai kebutuhan unit",
    status: "active",
    description:
      "Solusi kebutuhan kendaraan operasional untuk perusahaan dan pemilik usaha.",
    requirements:
      "Perusahaan atau pemilik usaha\nMemiliki kebutuhan kendaraan operasional",
    createdAt: new Date().toISOString()
  }
];


/* =========================================
   HELPERS
========================================= */

function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


/* =========================================
   OPPORTUNITIES LOCAL STORAGE
========================================= */

function getOpportunities() {

  const saved =
    localStorage.getItem(
      OPPORTUNITY_STORAGE_KEY
    );

  if (!saved) {

    localStorage.setItem(
      OPPORTUNITY_STORAGE_KEY,
      JSON.stringify(defaultOpportunities)
    );

    return defaultOpportunities;

  }

  try {
    return JSON.parse(saved);
  } catch {
    return defaultOpportunities;
  }

}

function saveOpportunities(data) {

  localStorage.setItem(
    OPPORTUNITY_STORAGE_KEY,
    JSON.stringify(data)
  );

}


/* =========================================
   ADMIN AUTH
========================================= */

const adminLogin =
  document.getElementById("adminLogin");

const adminApp =
  document.getElementById("adminApp");

const loginForm =
  document.getElementById("loginForm");

const adminEmail =
  document.getElementById("adminEmail");

const adminPassword =
  document.getElementById("adminPassword");

const adminLoginButton =
  document.getElementById("adminLoginButton");

const loginError =
  document.getElementById("loginError");

const logoutBtn =
  document.getElementById("logoutBtn");


function showLogin() {

  adminLogin.classList.remove("hidden");
  adminApp.classList.add("hidden");

}


async function showAdmin() {

  adminLogin.classList.add("hidden");
  adminApp.classList.remove("hidden");

  renderAll();
  await renderPartnerTable();

}


async function validateAdminSession() {

  const {
    data: { session }
  } =
    await adminSupabase.auth.getSession();

  if (
    session &&
    session.user &&
    session.user.email === ADMIN_EMAIL
  ) {

    await showAdmin();

  } else {

    if (session) {
      await adminSupabase.auth.signOut();
    }

    showLogin();

  }

}


loginForm.addEventListener(
  "submit",
  async function(event) {

    event.preventDefault();

    loginError.textContent = "";

    adminLoginButton.disabled = true;
    adminLoginButton.textContent =
      "Memeriksa Login...";

    try {

      const email =
        adminEmail.value
          .trim()
          .toLowerCase();

      if (email !== ADMIN_EMAIL) {

        throw new Error(
          "Email ini tidak memiliki akses Admin."
        );

      }

      const {
        data,
        error
      } =
        await adminSupabase.auth
          .signInWithPassword({
            email,
            password:
              adminPassword.value
          });

      if (error) {
        throw error;
      }

      if (
        !data.user ||
        data.user.email !== ADMIN_EMAIL
      ) {

        await adminSupabase.auth.signOut();

        throw new Error(
          "Akun tidak memiliki akses Admin."
        );

      }

      adminPassword.value = "";

      await showAdmin();

    } catch (error) {

      console.error(error);

      loginError.textContent =
        error.message ||
        "Login gagal. Periksa email dan password.";

    } finally {

      adminLoginButton.disabled = false;
      adminLoginButton.textContent =
        "Masuk Dashboard";

    }

  }
);


logoutBtn.addEventListener(
  "click",
  async function() {

    await adminSupabase.auth.signOut();
    showLogin();

  }
);


/* =========================================
   ADMIN NAVIGATION
========================================= */

const navButtons =
  document.querySelectorAll(
    ".admin-nav-item[data-section]"
  );

const sections = {
  dashboard:
    document.getElementById(
      "dashboardSection"
    ),

  opportunities:
    document.getElementById(
      "opportunitiesSection"
    ),

  add:
    document.getElementById(
      "addSection"
    ),

  partners:
    document.getElementById(
      "partnersSection"
    )
};

const pageTitle =
  document.getElementById("pageTitle");


async function showSection(sectionName) {

  Object.values(sections)
    .filter(Boolean)
    .forEach(section => {

      section.classList.remove(
        "active-section"
      );

    });

  navButtons.forEach(button => {

    button.classList.remove("active");

  });

  if (sections[sectionName]) {

    sections[sectionName]
      .classList.add(
        "active-section"
      );

  }

  const activeButton =
    document.querySelector(
      `[data-section="${sectionName}"]`
    );

  if (activeButton) {

    activeButton.classList.add("active");

  }

  const titles = {
    dashboard: "Dashboard",
    opportunities: "Kelola Peluang",
    add: "Tambah Peluang",
    partners: "Pendaftaran Mitra"
  };

  pageTitle.textContent =
    titles[sectionName] || "Dashboard";

  document
    .querySelector(".admin-sidebar")
    .classList.remove("mobile-open");

  if (sectionName === "partners") {

    await renderPartnerTable();

  }

}


navButtons.forEach(button => {

  button.addEventListener(
    "click",
    function() {

      showSection(
        this.dataset.section
      );

    }
  );

});


document
  .getElementById("mobileSidebarBtn")
  .addEventListener(
    "click",
    function() {

      document
        .querySelector(".admin-sidebar")
        .classList.toggle(
          "mobile-open"
        );

    }
  );


/* =========================================
   OPPORTUNITY FORM
========================================= */

const opportunityForm =
  document.getElementById(
    "adminOpportunityForm"
  );

const editOpportunityId =
  document.getElementById(
    "editOpportunityId"
  );

const adminTitle =
  document.getElementById("adminTitle");

const adminCategory =
  document.getElementById(
    "adminCategory"
  );

const adminLocation =
  document.getElementById(
    "adminLocation"
  );

const adminBudget =
  document.getElementById(
    "adminBudget"
  );

const adminStatus =
  document.getElementById(
    "adminStatus"
  );

const adminDescription =
  document.getElementById(
    "adminDescription"
  );

const adminRequirements =
  document.getElementById(
    "adminRequirements"
  );

const cancelEditBtn =
  document.getElementById(
    "cancelEditBtn"
  );

const formModeLabel =
  document.getElementById(
    "formModeLabel"
  );

const formTitle =
  document.getElementById(
    "formTitle"
  );


function resetForm() {

  opportunityForm.reset();

  editOpportunityId.value = "";

  adminStatus.value = "active";

  formModeLabel.textContent =
    "PELUANG BARU";

  formTitle.textContent =
    "Tambah Peluang";

  cancelEditBtn.classList.add(
    "hidden"
  );

}


document
  .querySelectorAll(".go-add-btn")
  .forEach(button => {

    button.addEventListener(
      "click",
      function() {

        resetForm();
        showSection("add");

      }
    );

  });


const goOpportunitiesButton =
  document.querySelector(
    ".go-opportunities-btn"
  );

if (goOpportunitiesButton) {

  goOpportunitiesButton
    .addEventListener(
      "click",
      function() {

        showSection(
          "opportunities"
        );

      }
    );

}


opportunityForm.addEventListener(
  "submit",
  function(event) {

    event.preventDefault();

    let opportunities =
      getOpportunities();

    const data = {

      title:
        adminTitle.value.trim(),

      category:
        adminCategory.value,

      location:
        adminLocation.value.trim(),

      budget:
        adminBudget.value.trim() ||
        "Tidak disebutkan",

      status:
        adminStatus.value,

      description:
        adminDescription.value.trim(),

      requirements:
        adminRequirements.value.trim()

    };

    if (editOpportunityId.value) {

      const id =
        Number(
          editOpportunityId.value
        );

      opportunities =
        opportunities.map(item => {

          if (item.id === id) {

            return {
              ...item,
              ...data,
              updatedAt:
                new Date().toISOString()
            };

          }

          return item;

        });

      alert(
        "Peluang berhasil diperbarui."
      );

    } else {

      opportunities.unshift({

        id: Date.now(),

        ...data,

        createdAt:
          new Date().toISOString()

      });

      alert(
        "Peluang baru berhasil ditambahkan."
      );

    }

    saveOpportunities(
      opportunities
    );

    resetForm();
    renderAll();
    showSection("opportunities");

  }
);


cancelEditBtn.addEventListener(
  "click",
  function() {

    resetForm();
    showSection("opportunities");

  }
);


window.editOpportunity =
  function(id) {

    const item =
      getOpportunities()
        .find(
          opportunity =>
            opportunity.id === id
        );

    if (!item) return;

    editOpportunityId.value =
      item.id;

    adminTitle.value =
      item.title;

    adminCategory.value =
      item.category;

    adminLocation.value =
      item.location;

    adminBudget.value =
      item.budget;

    adminStatus.value =
      item.status;

    adminDescription.value =
      item.description;

    adminRequirements.value =
      item.requirements || "";

    formModeLabel.textContent =
      "EDIT DATA";

    formTitle.textContent =
      "Edit Peluang";

    cancelEditBtn.classList.remove(
      "hidden"
    );

    showSection("add");

  };


window.deleteOpportunity =
  function(id) {

    if (
      !confirm(
        "Hapus peluang ini?"
      )
    ) return;

    const opportunities =
      getOpportunities()
        .filter(
          item =>
            item.id !== id
        );

    saveOpportunities(
      opportunities
    );

    renderAll();

  };


window.toggleOpportunity =
  function(id) {

    const opportunities =
      getOpportunities()
        .map(item => {

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

    saveOpportunities(
      opportunities
    );

    renderAll();

  };


/* =========================================
   OPPORTUNITY TABLE
========================================= */

function createOpportunityTable(data) {

  if (!data.length) {

    return `
      <div class="empty-state">
        <strong>Belum ada data.</strong>
        Tambahkan peluang baru.
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

                <strong>
                  ${escapeHTML(item.title)}
                </strong>

                <small>
                  ${escapeHTML(item.budget)}
                </small>

              </td>

              <td>
                ${escapeHTML(item.category)}
              </td>

              <td>
                ${escapeHTML(item.location)}
              </td>

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

  const opportunities =
    getOpportunities();

  const active =
    opportunities.filter(
      item =>
        item.status === "active"
    );

  const closed =
    opportunities.filter(
      item =>
        item.status === "closed"
    );

  const categories =
    new Set(
      opportunities.map(
        item => item.category
      )
    );

  document.getElementById(
    "totalOpportunities"
  ).textContent =
    opportunities.length;

  document.getElementById(
    "activeOpportunities"
  ).textContent =
    active.length;

  document.getElementById(
    "closedOpportunities"
  ).textContent =
    closed.length;

  document.getElementById(
    "totalCategories"
  ).textContent =
    categories.size;

  document.getElementById(
    "recentOpportunities"
  ).innerHTML =
    createOpportunityTable(
      opportunities.slice(0, 5)
    );

}


const adminSearch =
  document.getElementById(
    "adminSearch"
  );

const adminStatusFilter =
  document.getElementById(
    "adminStatusFilter"
  );


function renderOpportunityTable() {

  const keyword =
    adminSearch.value
      .toLowerCase()
      .trim();

  const status =
    adminStatusFilter.value;

  const opportunities =
    getOpportunities()
      .filter(item => {

        const searchable = `
          ${item.title}
          ${item.category}
          ${item.location}
          ${item.description}
        `.toLowerCase();

        return (

          searchable.includes(
            keyword
          )

          &&

          (
            status === "all" ||
            item.status === status
          )

        );

      });

  document.getElementById(
    "opportunityTable"
  ).innerHTML =
    createOpportunityTable(
      opportunities
    );

}


adminSearch.addEventListener(
  "input",
  renderOpportunityTable
);

adminStatusFilter.addEventListener(
  "change",
  renderOpportunityTable
);


/* =========================================
   SUPABASE PARTNERS
========================================= */

let onlinePartners = [];


async function loadPartners() {

  const {
    data,
    error
  } =
    await adminSupabase
      .from("partners")
      .select("*")
      .order(
        "created_at",
        {
          ascending: false
        }
      );

  if (error) {

    console.error(error);

    throw error;

  }

  onlinePartners =
    data || [];

  return onlinePartners;

}


function getPartnerStatusLabel(
  status
) {

  return {

    pending: "MENUNGGU",
    approved: "DITERIMA",
    rejected: "DITOLAK"

  }[status] || status;

}


function getPartnerStatusClass(
  status
) {

  return {

    pending:
      "partner-status-pending",

    approved:
      "partner-status-approved",

    rejected:
      "partner-status-rejected"

  }[status] || "";

}


async function renderPartnerTable() {

  const table =
    document.getElementById(
      "partnerTable"
    );

  if (!table) return;

  table.innerHTML = `
    <div class="empty-state">
      Memuat data mitra...
    </div>
  `;

  try {

    await loadPartners();

    const keyword =
      document
        .getElementById(
          "partnerSearch"
        )
        .value
        .toLowerCase()
        .trim();

    const status =
      document
        .getElementById(
          "partnerStatusFilter"
        )
        .value;

    const partners =
      onlinePartners.filter(
        partner => {

          const searchable = `
            ${partner.name || ""}
            ${partner.business_name || ""}
            ${partner.email || ""}
            ${partner.phone || ""}
            ${partner.category || ""}
            ${partner.service_area || ""}
            ${partner.service || ""}
          `.toLowerCase();

          return (

            searchable.includes(
              keyword
            )

            &&

            (
              status === "all" ||
              partner.status === status
            )

          );

        }
      );

    document.getElementById(
      "partnerTotal"
    ).textContent =
      onlinePartners.length;

    updatePartnerNotification();

    if (!partners.length) {

      table.innerHTML = `
        <div class="empty-state">
          <strong>
            Tidak ada data mitra.
          </strong>
        </div>
      `;

      return;

    }

    table.innerHTML = `
      <div class="partner-admin-grid">

        ${partners.map(partner => `

          <article class="partner-admin-card">

            <div class="partner-card-header">

              <div>

                <span class="partner-business-category">
                  ${escapeHTML(partner.category)}
                </span>

                <h3>
                  ${escapeHTML(partner.business_name)}
                </h3>

                <p>
                  ${escapeHTML(partner.name)}
                </p>

              </div>

              <span class="partner-status-badge ${getPartnerStatusClass(partner.status)}">

                ${getPartnerStatusLabel(partner.status)}

              </span>

            </div>

            <div class="partner-details">

              <div>
                <small>Nomor Kontak</small>
                <strong>
                  ${escapeHTML(partner.phone)}
                </strong>
              </div>

              <div>
                <small>Email</small>
                <strong>
                  ${escapeHTML(partner.email)}
                </strong>
              </div>

              <div>
                <small>Wilayah</small>
                <strong>
                  ${escapeHTML(partner.service_area)}
                </strong>
              </div>

            </div>

            <div class="partner-service-box">

              <small>
                PRODUK / JASA
              </small>

              <p>
                ${escapeHTML(partner.service)}
              </p>

            </div>

            <div class="partner-card-actions">

              ${
                partner.status !==
                "approved"

                ? `
                  <button
                    class="partner-action approve-partner"
                    onclick="updatePartnerStatus(${partner.id}, 'approved')"
                  >
                    ✓ Terima
                  </button>
                `

                : ""
              }

              ${
                partner.status !==
                "rejected"

                ? `
                  <button
                    class="partner-action reject-partner"
                    onclick="updatePartnerStatus(${partner.id}, 'rejected')"
                  >
                    Tolak
                  </button>
                `

                : ""
              }

              <a
                href="mailto:${encodeURIComponent(partner.email)}"
                class="partner-action"
              >
                Email
              </a>

              <button
                class="partner-action delete-partner"
                onclick="deletePartner(${partner.id})"
              >
                Hapus
              </button>

            </div>

          </article>

        `).join("")}

      </div>
    `;

  } catch (error) {

    table.innerHTML = `
      <div class="empty-state">

        <strong>
          Gagal memuat data mitra.
        </strong>

        Periksa login Admin dan policy Supabase.

      </div>
    `;

  }

}


window.updatePartnerStatus =
  async function(
    id,
    status
  ) {

    const {
      error
    } =
      await adminSupabase
        .from("partners")
        .update({
          status,
          updated_at:
            new Date().toISOString()
        })
        .eq("id", id);

    if (error) {

      alert(
        "Gagal memperbarui status."
      );

      console.error(error);

      return;

    }

    await renderPartnerTable();

  };


window.deletePartner =
  async function(id) {

    if (
      !confirm(
        "Hapus data mitra ini?"
      )
    ) return;

    const {
      error
    } =
      await adminSupabase
        .from("partners")
        .delete()
        .eq("id", id);

    if (error) {

      alert(
        "Gagal menghapus data."
      );

      console.error(error);

      return;

    }

    await renderPartnerTable();

  };


function updatePartnerNotification() {

  const notification =
    document.getElementById(
      "partnerNotification"
    );

  if (!notification) return;

  const pending =
    onlinePartners.filter(
      partner =>
        partner.status ===
        "pending"
    ).length;

  if (pending > 0) {

    notification.textContent =
      pending;

    notification.classList.remove(
      "hidden"
    );

  } else {

    notification.classList.add(
      "hidden"
    );

  }

}


document
  .getElementById(
    "partnerSearch"
  )
  .addEventListener(
    "input",
    renderPartnerTable
  );


document
  .getElementById(
    "partnerStatusFilter"
  )
  .addEventListener(
    "change",
    renderPartnerTable
  );


/* =========================================
   RENDER
========================================= */

function renderAll() {

  renderDashboard();
  renderOpportunityTable();

}


/* =========================================
   START APPLICATION
========================================= */

validateAdminSession();
