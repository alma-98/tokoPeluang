const publicSupabaseConfig =
  window.TOKOPELUANG_SUPABASE;

const publicSupabase =
  window.supabase.createClient(
    publicSupabaseConfig.url,
    publicSupabaseConfig.key
  );

const publicOpportunityGrid =
  document.getElementById(
    "opportunityGrid"
  );


function publicEscapeHTML(
  value = ""
) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


async function loadPublicOpportunities() {

  if (!publicOpportunityGrid) {
    return;
  }

  publicOpportunityGrid.innerHTML = `
    <div class="loading-opportunities">
      Memuat peluang terbaru...
    </div>
  `;

  const {
    data,
    error
  } =
    await publicSupabase
      .from("opportunities")
      .select("*")
      .eq(
        "status",
        "active"
      )
      .order(
        "created_at",
        {
          ascending: false
        }
      );

  if (error) {

    console.error(error);

    publicOpportunityGrid.innerHTML = `
      <div class="loading-opportunities">
        Peluang belum dapat dimuat.
      </div>
    `;

    return;

  }

  if (!data.length) {

    publicOpportunityGrid.innerHTML = `
      <div class="loading-opportunities">
        Belum ada peluang aktif.
      </div>
    `;

    return;

  }

  publicOpportunityGrid.innerHTML =
    data.map(item => `

      <article
        class="opportunity-card"
        data-type="${publicEscapeHTML(
          item.opportunity_type || ""
        )}"
        data-subcategory="${publicEscapeHTML(
          item.subcategory || ""
        )}"
        data-category="${publicEscapeHTML(
          item.category || ""
        )}"
      >

        <span class="tag">
          ${publicEscapeHTML(
            item.category
          )}
        </span>

        <h3>
          ${publicEscapeHTML(
            item.title
          )}
        </h3>

        <p>
          ${publicEscapeHTML(
            item.description
          )}
        </p>

        <div class="card-footer">

          <span>
            📍
            ${publicEscapeHTML(
              item.location
            )}
          </span>

          <a
            href="mailto:alma.budsteddy88@gmail.com?subject=${encodeURIComponent(
              "Tertarik Peluang: " +
              item.title
            )}"
          >
            Ambil Peluang →
          </a>

        </div>

      </article>

    `).join("");

}


loadPublicOpportunities();
