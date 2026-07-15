const SUPABASE_URL =
  "https://ludpzbolaeyszgbnhplr.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_Kp9btF03oqQ9hLCMV-yBVg_JYUCKyjQ";


function saveAdminSession(
  session
) {

  localStorage.setItem(
    "tokopeluang_admin_session",
    JSON.stringify(
      session
    )
  );

}


async function checkAdminRole(
  accessToken,
  userId
) {

  const response =
    await fetch(
      `${SUPABASE_URL}` +
      `/rest/v1/admin_users` +
      `?user_id=eq.${encodeURIComponent(userId)}` +
      `&select=user_id,role`,
      {
        headers: {
          "apikey":
            SUPABASE_KEY,

          "Authorization":
            `Bearer ${accessToken}`
        }
      }
    );


  if (!response.ok) {

    throw new Error(
      "Gagal memeriksa hak akses admin."
    );

  }


  const data =
    await response.json();


  return (
    Array.isArray(data) &&
    data.length > 0
  );

}


async function loginAdmin(
  email,
  password
) {

  const response =
    await fetch(
      `${SUPABASE_URL}` +
      `/auth/v1/token?grant_type=password`,
      {
        method: "POST",

        headers: {
          "apikey":
            SUPABASE_KEY,

          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify({
            email,
            password
          })
      }
    );


  const data =
    await response.json();


  if (!response.ok) {

    throw new Error(
      data.error_description ||
      data.msg ||
      "Email atau password salah."
    );

  }


  const isAdmin =
    await checkAdminRole(
      data.access_token,
      data.user.id
    );


  if (!isAdmin) {

    throw new Error(
      "Akun ini tidak memiliki akses admin."
    );

  }


  saveAdminSession(
    data
  );


  window.location.href =
    "admin.html";

}


document.addEventListener(
  "DOMContentLoaded",
  function () {

    const form =
      document.getElementById(
        "adminLoginForm"
      );

    const button =
      document.getElementById(
        "adminLoginButton"
      );

    const message =
      document.getElementById(
        "adminLoginMessage"
      );


    form.addEventListener(
      "submit",
      async function (
        event
      ) {

        event.preventDefault();


        button.disabled =
          true;

        button.textContent =
          "Memeriksa Akses...";

        message.textContent =
          "";


        try {

          await loginAdmin(

            document
              .getElementById(
                "adminEmail"
              )
              .value
              .trim(),

            document
              .getElementById(
                "adminPassword"
              )
              .value

          );

        }

        catch (
          error
        ) {

          message.textContent =
            error.message;

          button.disabled =
            false;

          button.textContent =
            "Masuk Dashboard";

        }

      }
    );

  }
);
