const DATA_URL = "./datos/categorias.json";

const elLoading = document.getElementById("loading");
const elError = document.getElementById("error");
const elErrorMsg = document.getElementById("errorMsg");
const elAccordionWrap = document.getElementById("accordionWrap");
const elAccordion = document.getElementById("categoriasAccordion");

const btnExpandAll = document.getElementById("btnExpandAll");
const btnCollapseAll = document.getElementById("btnCollapseAll");

function escapeHtml(str) {
  // Previene inyección si el JSON viene de usuarios/externo.
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setUIState({ loading, errorMsg }) {
  if (loading) {
    elLoading.classList.remove("d-none");
    elAccordionWrap.classList.add("d-none");
    elError.classList.add("d-none");
    return;
  }

  elLoading.classList.add("d-none");

  if (errorMsg) {
    elErrorMsg.textContent = errorMsg;
    elError.classList.remove("d-none");
    elAccordionWrap.classList.add("d-none");
    return;
  }

  elError.classList.add("d-none");
  elAccordionWrap.classList.remove("d-none");
}

function buildAccordion(categorias) {
  elAccordion.innerHTML = "";

  categorias.forEach((cat, idx) => {
    const catId = cat.id || `cat_${idx}`;
    const headingId = `heading_${catId}`;
    const collapseId = `collapse_${catId}`;

    const subcats = Array.isArray(cat.subcategorias) ? cat.subcategorias : [];
    const subcatCount = subcats.length;

    const subcatHtml =
      subcats.length === 0
        ? `<div class="text-muted small">No hay subcategorías registradas.</div>`
        : `
          <ul class="list-unstyled subcat-list m-0">
            ${subcats
              .map(
                (s) => `
                  <li class="subcat-item">
                    <span class="subcat-dot"></span>
                    <span>${escapeHtml(s.nombre ?? "")}</span>
                  </li>
                `
              )
              .join("")}
          </ul>
        `;

    const item = document.createElement("div");
    item.className = "accordion-item";

    item.innerHTML = `
      <h2 class="accordion-header" id="${headingId}">
        <button
          class="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#${collapseId}"
          aria-expanded="false"
          aria-controls="${collapseId}"
        >
          <span class="me-2">${escapeHtml(cat.nombre ?? "Sin nombre")}</span>
          <span class="badge badge-soft ms-auto">${subcatCount} opciones</span>
        </button>
      </h2>

      <div
        id="${collapseId}"
        class="accordion-collapse collapse"
        aria-labelledby="${headingId}"
        data-bs-parent="#categoriasAccordion"
      >
        <div class="accordion-body">
          <p class="text-muted mb-3">${escapeHtml(cat.descripcion ?? "")}</p>
          <div class="fw-semibold mb-2">Subcategorías</div>
          ${subcatHtml}
        </div>
      </div>
    `;

    elAccordion.appendChild(item);
  });
}

function expandAll() {
  document.querySelectorAll("#categoriasAccordion .accordion-collapse").forEach((el) => {
    const instance = bootstrap.Collapse.getOrCreateInstance(el, { toggle: false });
    instance.show();
  });
}

function collapseAll() {
  document.querySelectorAll("#categoriasAccordion .accordion-collapse").forEach((el) => {
    const instance = bootstrap.Collapse.getOrCreateInstance(el, { toggle: false });
    instance.hide();
  });
}

async function init() {
  try {
    setUIState({ loading: true });

    const res = await fetch(DATA_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status} al cargar ${DATA_URL}`);

    const data = await res.json();

    const categorias = Array.isArray(data?.categorias) ? data.categorias : [];
    if (categorias.length === 0) {
      throw new Error("El JSON cargó, pero no trae 'categorias' o está vacío.");
    }

    buildAccordion(categorias);
    setUIState({ loading: false });
  } catch (err) {
    setUIState({ loading: false, errorMsg: err?.message || "Error desconocido" });
    console.error(err);
  }
}


// ------------------
// MODO OSCURO
// ------------------

const themeToggle = document.getElementById("themeToggle");
const htmlEl = document.documentElement;

function setTheme(theme) {
  htmlEl.setAttribute("data-bs-theme", theme);
  localStorage.setItem("theme", theme);

  themeToggle.textContent =
    theme === "dark" ? "☀️ Modo claro" : "🌙 Modo oscuro";
}

// Cargar preferencia guardada
(function loadTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    setTheme("light");
  }
})();

// Evento toggle
themeToggle.addEventListener("click", () => {
  const current = htmlEl.getAttribute("data-bs-theme");
  setTheme(current === "dark" ? "light" : "dark");
});


btnExpandAll.addEventListener("click", expandAll);
btnCollapseAll.addEventListener("click", collapseAll);

init();