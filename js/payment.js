const SUPABASE_URL =
  "https://ludpzbolaeyszgbnhplr.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_Kp9btF03oqQ9hLCMV-yBVg_JYUCKyjQ";


function escapeFileName(value) {

  return String(value || "payment")
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/^-+|-+$/g, "");

}


function getPaymentParameters() {

  const params =
    new URLSearchParams(
      window.location.search
    );

  return {
    id:
      params.get("id") || "",

    title:
      params.get("title") ||
      "Akses Peluang TokoPeluang",

    category:
      params.get("category") ||
      "Peluang Bisnis",

    location:
      params.get("location") ||
      "Indonesia"
  };

}


function loadSelectedOpportunity() {

  const opportunity =
    getPaymentParameters();

  document
    .getElementById(
      "selectedOpportunityTitle"
    )
    .textContent =
      opportunity.title;

  document
    .getElementById(
      "selectedOpportunityCategory"
    )
    .textContent =
      opportunity.category;

  document
    .getElementById(
      "selectedOpportunityLocation"
    )
    .textContent =
      opportunity.location;

  document
    .getElementById(
      "opportunityId"
    )
    .value =
      opportunity.id;

  document
    .getElementById(
      "opportunityTitle"
    )
    .value =
      opportunity.title;

}


async function uploadPaymentProof(
  file
) {

  const extension =
    file.name
      .split(".")
      .pop()
      .toLowerCase();

  const timestamp =
    Date.now();

  const safeName =
    escapeFileName(
      file.name
    );

  const filePath =
    `${timestamp}-${safeName}.${extension}`;

  const uploadResponse =
    await fetch(
      `${SUPABASE_URL}` +
      `/storage/v1/object/` +
      `payment-proofs/` +
      `${filePath}`,
      {
        method: "POST",

        headers: {
          "apikey":
            SUPABASE_KEY,

          "Authorization":
            `Bearer ${SUPABASE_KEY}`,

          "Content-Type":
            file.type,

          "x-upsert":
            "false"
        },

        body:
          file
      }
    );


  if (!uploadResponse.ok) {

    const errorText =
      await uploadResponse.text();

    throw new Error(
      "Upload bukti pembayaran gagal: " +
      errorText
    );

  }


  return (
    `${SUPABASE_URL}` +
    `/storage/v1/object/public/` +
    `payment-proofs/` +
    `${filePath}`
  );

}


async function savePaymentConfirmation(
  payload
) {

  const response =
    await fetch(
      `${SUPABASE_URL}` +
      `/rest/v1/opportunity_payments`,
      {
        method: "POST",

        headers: {
          "apikey":
            SUPABASE_KEY,

          "Authorization":
            `Bearer ${SUPABASE_KEY}`,

          "Content-Type":
            "application/json",

          "Prefer":
            "return=representation"
        },

        body:
          JSON.stringify(
            payload
          )
      }
    );


  if (!response.ok) {

    const errorText =
      await response.text();

    throw new Error(
      "Penyimpanan konfirmasi gagal: " +
      errorText
    );

  }


  return response.json();

}


function showPaymentMessage(
  message,
  type
) {

  const box =
    document.getElementById(
      "paymentMessage"
    );

  box.textContent =
    message;

  box.className =
    `payment-message show ${type}`;

}


document.addEventListener(
  "DOMContentLoaded",
  function () {

    loadSelectedOpportunity();


    const form =
      document.getElementById(
        "paymentConfirmationForm"
      );

    const proofInput =
      document.getElementById(
        "paymentProof"
      );

    const selectedFileName =
      document.getElementById(
        "selectedFileName"
      );

    const submitButton =
      document.getElementById(
        "submitPaymentButton"
      );


    proofInput.addEventListener(
      "change",
      function () {

        const file =
          this.files[0];

        selectedFileName
          .textContent =
            file
              ? `File dipilih: ${file.name}`
              : "";

      }
    );


    form.addEventListener(
      "submit",
      async function (event) {

        event.preventDefault();


        const proofFile =
          proofInput.files[0];

        if (!proofFile) {

          showPaymentMessage(
            "Silakan upload bukti pembayaran.",
            "error"
          );

          return;

        }


        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/webp"
        ];


        if (
          !allowedTypes.includes(
            proofFile.type
          )
        ) {

          showPaymentMessage(
            "Format bukti pembayaran harus JPG, PNG, atau WEBP.",
            "error"
          );

          return;

        }


        if (
          proofFile.size >
          5 * 1024 * 1024
        ) {

          showPaymentMessage(
            "Ukuran bukti pembayaran maksimal 5 MB.",
            "error"
          );

          return;

        }


        submitButton.disabled =
          true;

        submitButton.textContent =
          "Mengirim Konfirmasi...";


        try {

          const proofUrl =
            await uploadPaymentProof(
              proofFile
            );


          const payload = {

            opportunity_id:
              document
                .getElementById(
                  "opportunityId"
                )
                .value,

            opportunity_title:
              document
                .getElementById(
                  "opportunityTitle"
                )
                .value,

            customer_name:
              document
                .getElementById(
                  "customerName"
                )
                .value
                .trim(),

            customer_email:
              document
                .getElementById(
                  "customerEmail"
                )
                .value
                .trim(),

            customer_phone:
              document
                .getElementById(
                  "customerPhone"
                )
                .value
                .trim(),

            amount:
              Number(
                document
                  .getElementById(
                    "paymentAmount"
                  )
                  .value
              ),

            payment_method:
              "QRIS",

            payment_proof_url:
              proofUrl,

            status:
              "pending"

          };


          await savePaymentConfirmation(
            payload
          );


          form.reset();

          selectedFileName
            .textContent =
              "";


          showPaymentMessage(
            "Konfirmasi pembayaran berhasil dikirim. Status pembayaran Anda sekarang Menunggu Verifikasi oleh Founder — Investment Technology Indonesia.",
            "success"
          );


          submitButton.textContent =
            "Konfirmasi Berhasil Dikirim";

        }

        catch (error) {

          console.error(
            error
          );


          showPaymentMessage(
            error.message ||
            "Terjadi kesalahan. Silakan coba kembali.",
            "error"
          );


          submitButton.disabled =
            false;

          submitButton.textContent =
            "Kirim Konfirmasi Pembayaran";

        }

      }
    );

  }
);
