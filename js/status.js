const SUPABASE_URL =
  "https://ludpzbolaeyszgbnhplr.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_Kp9btF03oqQ9hLCMV-yBVg_JYUCKyjQ";


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
      Number(
        value || 0
      )
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
      new Date(
        value
      )
    );

}


function resetStatusInformation() {

  document
    .getElementById(
      "pendingInformation"
    )
    .hidden =
      true;


  document
    .getElementById(
      "approvedInformation"
    )
    .hidden =
      true;


  document
    .getElementById(
      "rejectedInformation"
    )
    .hidden =
      true;

}


function showResult(
  payment
) {

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


  const statusLabels = {

    pending:
      "Menunggu Verifikasi",

    approved:
      "Disetujui",

    rejected:
      "Ditolak"

  };


  badge.textContent =
    statusLabels[
      payment.status
    ] ||
    payment.status;


  document
    .getElementById(
      "resultOpportunityTitle"
    )
    .textContent =
      payment.opportunity_title;


  document
    .getElementById(
      "resultName"
    )
    .textContent =
      payment.customer_name;


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


    document
      .getElementById(
        "approvedAccessContent"
      )
      .innerHTML = `

        <strong>
          Permintaan akses Anda telah disetujui.
        </strong>

        <p>
          Untuk proses lanjutan dan informasi peluang,
          hubungi pengelola TokoPeluang melalui email.
        </p>

        <a
          href="mailto:alma.budsteddy88@gmail.com?subject=${encodeURIComponent(
            "Akses Peluang TokoPeluang - " +
            payment.opportunity_title
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
    behavior:
      "smooth",

    block:
      "start"
  });

}


async function checkPaymentStatus(
  requestId,
  email
) {

  const query =
    `${SUPABASE_URL}` +
    `/rest/v1/opportunity_payments` +
    `?id=eq.${encodeURIComponent(requestId)}` +
    `&customer_email=eq.${encodeURIComponent(email)}` +
    `&select=` +
    [
      "id",
      "opportunity_title",
      "customer_name",
      "customer_email",
      "amount",
      "status",
      "created_at",
      "verified_at"
    ].join(",");


  const response =
    await fetch(
      query,
      {
        headers: {
          "apikey":
            SUPABASE_KEY,

          "Authorization":
            `Bearer ${SUPABASE_KEY}`
        }
      }
    );


  if (!response.ok) {

    throw new Error(
      "Status belum dapat diperiksa. Pastikan sistem akses publik sudah diaktifkan."
    );

  }


  const data =
    await response.json();


  if (
    !Array.isArray(data) ||
    data.length === 0
  ) {

    throw new Error(
      "Permintaan tidak ditemukan. Periksa kembali ID permintaan dan email."
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


    const params =
      new URLSearchParams(
        window.location.search
      );


    const idFromUrl =
      params.get(
        "id"
      );


    const emailFromUrl =
      params.get(
        "email"
      );


    if (
      idFromUrl
    ) {

      document
        .getElementById(
          "requestId"
        )
        .value =
          idFromUrl;

    }


    if (
      emailFromUrl
    ) {

      document
        .getElementById(
          "requestEmail"
        )
        .value =
          emailFromUrl;

    }


    form.addEventListener(
      "submit",
      async function (
        event
      ) {

        event.preventDefault();


        message.textContent =
          "";


        button.disabled =
          true;


        button.textContent =
          "Memeriksa Status...";


        try {

          const payment =
            await checkPaymentStatus(

              document
                .getElementById(
                  "requestId"
                )
                .value
                .trim(),

              document
                .getElementById(
                  "requestEmail"
                )
                .value
                .trim()

            );


          showResult(
            payment
          );

        }

        catch (
          error
        ) {

          document
            .getElementById(
              "statusResult"
            )
            .hidden =
              true;


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
