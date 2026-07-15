const SUPABASE_URL =
  "https://ludpzbolaeyszgbnhplr.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_Kp9btF03oqQ9hLCMV-yBVg_JYUCKyjQ";


let paymentData = [];

let activeFilter =
  "all";

let selectedPaymentId =
  null;


function getSession() {

  try {

    return JSON.parse(
      localStorage.getItem(
        "tokopeluang_admin_session"
      )
    );

  }

  catch {

    return null;

  }

}


function requireAdminSession() {

  const session =
    getSession();


  if (
    !session ||
    !session.access_token
  ) {

    window.location.href =
      "admin-login.html";

    return null;

  }


  return session;

}


function formatRupiah(
  value
) {

  return new Intl
    .NumberFormat(
      "id-ID",
      {
        style:
          "currency",

        currency:
          "IDR",

        maximumFractionDigits:
          0
      }
    )
    .format(
      Number(value || 0)
    );

}


function formatDate(
  value
) {

  if (!value) {
    return "-";
  }


  return new Intl
    .DateTimeFormat(
      "id-ID",
      {
        dateStyle:
          "medium",

        timeStyle:
          "short"
      }
    )
    .format(
      new Date(value)
    );

}


function escapeHTML(
  value
) {

  const div =
    document.createElement(
      "div"
    );

  div.textContent =
    String(
      value || ""
    );

  return div.innerHTML;

}


async function loadPayments() {

  const session =
    requireAdminSession();


  if (!session) {
    return;
  }


  const loading =
    document.getElementById(
      "adminLoading"
    );


  loading.hidden =
    false;


  const response =
    await fetch(
      `${SUPABASE_URL}` +
      `/rest/v1/opportunity_payments` +
      `?select=*` +
      `&order=created_at.desc`,
      {
        headers: {
          "apikey":
            SUPABASE_KEY,

          "Authorization":
            `Bearer ${session.access_token}`
        }
      }
    );


  if (
    response.status === 401
  ) {

    localStorage.removeItem(
      "tokopeluang_admin_session"
    );

    window.location.href =
      "admin-login.html";

    return;

  }


  if (!response.ok) {

    loading.textContent =
      "Gagal memuat pembayaran.";

    return;

  }


  paymentData =
    await response.json();


  loading.hidden =
    true;


  updateStatistics();

  renderPayments();

}


function updateStatistics() {

  document
    .getElementById(
      "totalPaymentCount"
    )
    .textContent =
      paymentData.length;


  document
    .getElementById(
      "pendingPaymentCount"
    )
    .textContent =
      paymentData.filter(
        item =>
          item.status ===
          "pending"
      ).length;


  document
    .getElementById(
      "approvedPaymentCount"
    )
    .textContent =
      paymentData.filter(
        item =>
          item.status ===
          "approved"
      ).length;


  document
    .getElementById(
      "rejectedPaymentCount"
    )
    .textContent =
      paymentData.filter(
        item =>
          item.status ===
          "rejected"
      ).length;

}


function renderPayments() {

  const list =
    document.getElementById(
      "paymentList"
    );

  const empty =
    document.getElementById(
      "adminEmptyState"
    );


  const filtered =
    activeFilter ===
    "all"

      ? paymentData

      : paymentData.filter(
          item =>
            item.status ===
            activeFilter
        );


  list.innerHTML =
    "";


  if (
    filtered.length === 0
  ) {

    empty.hidden =
      false;

    return;

  }


  empty.hidden =
    true;


  filtered.forEach(
    payment => {

      const item =
        document.createElement(
          "article"
        );


      item.className =
        "admin-payment-item";


      item.innerHTML = `

        <div>

          <strong>
            ${escapeHTML(
              payment.opportunity_title
            )}
          </strong>

          <small>
            ${escapeHTML(
              payment.customer_name
            )}
          </small>

        </div>


        <div>

          <strong>
            ${formatRupiah(
              payment.amount
            )}
          </strong>

          <small>
            QRIS
          </small>

        </div>


        <div>

          <span
            class="
              admin-status
              ${escapeHTML(
                payment.status
              )}
            "
          >
            ${escapeHTML(
              payment.status
            )}
          </span>

        </div>


        <div>

          <small>
            ${formatDate(
              payment.created_at
            )}
          </small>

        </div>


        <button
          class="admin-view-button"
          data-payment-id="${payment.id}"
        >
          Lihat
        </button>

      `;


      list.appendChild(
        item
      );

    }
  );

}


function openPaymentModal(
  paymentId
) {

  const payment =
    paymentData.find(
      item =>
        item.id ===
        paymentId
    );


  if (!payment) {
    return;
  }


  selectedPaymentId =
    payment.id;


  document
    .getElementById(
      "modalOpportunityTitle"
    )
    .textContent =
      payment.opportunity_title;


  document
    .getElementById(
      "modalPaymentDetail"
    )
    .innerHTML = `

      <strong>
        Nama:
      </strong>
      ${escapeHTML(
        payment.customer_name
      )}

      <strong>
        Email:
      </strong>
      ${escapeHTML(
        payment.customer_email
      )}

      <strong>
        Kontak:
      </strong>
      ${escapeHTML(
        payment.customer_phone
      )}

      <strong>
        Nominal:
      </strong>
      ${formatRupiah(
        payment.amount
      )}

      <strong>
        Status:
      </strong>
      ${escapeHTML(
        payment.status
      )}

    `;


  document
    .getElementById(
      "modalPaymentProof"
    )
    .src =
      payment.payment_proof_url;


  document
    .getElementById(
      "paymentModal"
    )
    .hidden =
      false;

}


function closePaymentModal() {

  document
    .getElementById(
      "paymentModal"
    )
    .hidden =
      true;


  selectedPaymentId =
    null;

}


async function updatePaymentStatus(
  status
) {

  if (
    !selectedPaymentId
  ) {
    return;
  }


  const session =
    requireAdminSession();


  if (!session) {
    return;
  }


  const payload = {

    status,

    verified_at:
      new Date()
        .toISOString()

  };


  const response =
    await fetch(
      `${SUPABASE_URL}` +
      `/rest/v1/opportunity_payments` +
      `?id=eq.${selectedPaymentId}`,
      {
        method:
          "PATCH",

        headers: {
          "apikey":
            SUPABASE_KEY,

          "Authorization":
            `Bearer ${session.access_token}`,

          "Content-Type":
            "application/json",

          "Prefer":
            "return=minimal"
        },

        body:
          JSON.stringify(
            payload
          )
      }
    );


  const message =
    document.getElementById(
      "modalMessage"
    );


  if (!response.ok) {

    message.textContent =
      "Gagal memperbarui status.";

    return;

  }


  message.textContent =
    status ===
    "approved"

      ? "Pembayaran berhasil disetujui."

      : "Pembayaran ditolak.";


  await loadPayments();


  setTimeout(
    closePaymentModal,
    700
  );

}


document.addEventListener(
  "DOMContentLoaded",
  function () {

    requireAdminSession();

    loadPayments();


    document
      .getElementById(
        "adminRefreshButton"
      )
      .addEventListener(
        "click",
        loadPayments
      );


    document
      .getElementById(
        "adminLogoutButton"
      )
      .addEventListener(
        "click",
        function () {

          localStorage.removeItem(
            "tokopeluang_admin_session"
          );

          window.location.href =
            "admin-login.html";

        }
      );


    document
      .querySelectorAll(
        ".admin-nav-item"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            function () {

              document
                .querySelectorAll(
                  ".admin-nav-item"
                )
                .forEach(
                  item =>
                    item.classList
                      .remove(
                        "active"
                      )
                );


              this.classList.add(
                "active"
              );


              activeFilter =
                this.dataset.filter;


              renderPayments();

            }
          );

        }
      );


    document
      .getElementById(
        "paymentList"
      )
      .addEventListener(
        "click",
        function (
          event
        ) {

          const button =
            event.target.closest(
              "[data-payment-id]"
            );


          if (!button) {
            return;
          }


          openPaymentModal(
            button.dataset
              .paymentId
          );

        }
      );


    document
      .getElementById(
        "closePaymentModal"
      )
      .addEventListener(
        "click",
        closePaymentModal
      );


    document
      .querySelector(
        ".admin-modal-backdrop"
      )
      .addEventListener(
        "click",
        closePaymentModal
      );


    document
      .getElementById(
        "approvePaymentButton"
      )
      .addEventListener(
        "click",
        function () {

          updatePaymentStatus(
            "approved"
          );

        }
      );


    document
      .getElementById(
        "rejectPaymentButton"
      )
      .addEventListener(
        "click",
        function () {

          updatePaymentStatus(
            "rejected"
          );

        }
      );

  }
);
