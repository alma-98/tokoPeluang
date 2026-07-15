const SUPABASE_URL =
  "https://ludpzbolaeyszgbnhplr.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_Kp9btF03oqQ9hLCMV-yBVg_JYUCKyjQ";


function formatRupiah(value) {

  return new Intl.NumberFormat(
    "id-ID",
    {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }
  ).format(
    Number(value || 0)
  );

}


function formatDate(value) {

  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat(
    "id-ID",
    {
      dateStyle: "medium",
      timeStyle: "short"
    }
  ).format(
    new Date(value)
  );

}


function resetStatusInformation() {

  [
    "pendingInformation",
    "approvedInformation",
    "rejectedInformation"
  ].forEach(
    id => {

      const element =
        document.getElementById(id);

      if (element) {
        element.hidden = true;
      }

    }
  );

}


function showResult(payment) {

  const result =
    document.getElementById(
      "statusResult"
    );

  const badge =
    document.getElementById(
      "statusBadge"
    );


  resetStatusInformation();


  result.hidden =
    false;


  badge.className =
    `status-badge ${payment.status}`;


  const labels = {

    pending:
      "Menunggu Verifikasi",

    approved:
      "Disetujui",

    rejected:
      "Ditolak"

  };


  badge.textContent =
    labels[payment.status] ||
    payment.status;


  document
    .getElementById(
      "resultOpportunityTitle"
    )
    .textContent =
      payment.opportunity_title ||
      "Peluang TokoPeluang";


  document
    .getElementById(
      "resultName"
    )
    .textContent =
      payment.customer_name ||
      "-";


  document
    .getElementById(
      "resultAmount"
    )
    .textContent =
      formatRupiah(
        payment.amount
      );


  document
    .getElementById(
      "resultDate"
    )
    .textContent =
      formatDate(
        payment.created_at
      );


  if (
    payment.status ===
    "pending"
  ) {

    document
      .getElementById(
        "pendingInformation"
      )
      .hidden =
        false;

  }


  if (
    payment.status ===
    "approved"
  ) {

    document
      .getElementById(
        "approvedInformation"
      )
      .hidden =
        false;


    const accessContent =
      document.getElementById(
        "approvedAccessContent"
      );


    accessContent.innerHTML = `

      <strong>
        Pembayaran telah diverifikasi.
      </strong>

      <p>
        Permintaan akses peluang Anda telah
        disetujui oleh pengelola TokoPeluang.
      </p>

      <a
        href="mailto:alma.budsteddy88@gmail.com?subject=${encodeURIComponent(
          "Akses Peluang TokoPeluang - " +
          (
            payment.opportunity_title ||
            "Peluang"
          )
        )}"
      >
        Hubungi Pengelola
      </a>

    `;

  }


  if (
    payment.status ===
    "rejected"
  ) {

    document
      .getElementById(
        "rejectedInformation"
      )
      .hidden =
        false;

  }


  result.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

}


async function checkPaymentStatus(
  requestId,
  email
) {

  const response =
    await fetch(
      `${SUPABASE_URL}/rest/v1/rpc/check_payment_status`,
      {
        method: "POST",

        headers: {

          "apikey":
            SUPABASE_KEY,

          "Authorization":
            `Bearer ${SUPABASE_KEY}`,

          "Content-Type":
            "application/json"

        },

        body:
          JSON.stringify({

            p_request_id:
              requestId,

            p_email:
              email

          })

      }
    );


  let data = null;


  try {

    data =
      await response.json();

  }

  catch {

    data =
      null;

  }


  if (!response.ok) {

    if (
      response.status === 400
    ) {

      throw new Error(
        "ID permintaan tidak valid. Periksa kembali ID Anda."
      );

    }


    throw new Error(
      "Status belum dapat diperiksa. Silakan coba kembali."
    );

  }


  if (
    !Array.isArray(data) ||
    data.length === 0
  ) {

    throw new Error(
      "Permintaan tidak ditemukan. Pastikan ID dan email sesuai."
    );

  }


  return data[0];

}


document.addEventListener(
  "DOMContentLoaded",
  function () {

    const form =
      document.getElementById(
        "statusForm"
      );


    const button =
      document.getElementById(
        "checkStatusButton"
      );


    const message =
      document.getElementById(
        "statusMessage"
      );


    const requestIdInput =
      document.getElementById(
        "requestId"
      );


    const requestEmailInput =
      document.getElementById(
        "requestEmail"
      );


    const params =
      new URLSearchParams(
        window.location.search
      );


    const idFromUrl =
      params.get("id");


    const emailFromUrl =
      params.get("email");


    if (idFromUrl) {

      requestIdInput.value =
        idFromUrl;

    }


    if (emailFromUrl) {

      requestEmailInput.value =
        emailFromUrl;

    }


    form.addEventListener(
      "submit",
      async function (event) {

        event.preventDefault();


        message.textContent =
          "";


        document
          .getElementById(
            "statusResult"
          )
          .hidden =
            true;


        button.disabled =
          true;


        button.textContent =
          "Memeriksa Status...";


        try {

          const payment =
            await checkPaymentStatus(

              requestIdInput
                .value
                .trim(),

              requestEmailInput
                .value
                .trim()

            );


          showResult(
            payment
          );

        }

        catch (error) {

          message.textContent =
            error.message;

        }

        finally {

          button.disabled =
            false;


          button.textContent =
            "Cek Status";

        }

      }
    );

  }
);
