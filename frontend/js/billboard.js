// --- billboard.js ---
// Maneja la carga y visualización de espectáculos desde el backend (vista cartelera)

// Seleccionamos elementos del HTML
const template = document.querySelector("#show-card");
const list = document.querySelector(".show-list");

let allShows = []; // Guarda todos los espectáculos cargados

// // Verifica si hay sesión activa
// const token = sessionStorage.getItem('token');
// if (!token) {
//   window.location.href = 'login.html'; // redirige si no hay sesión
// } else {
//   // Oculta el botón de login si hay sesión
//   const loginBtn = document.getElementById('btnLogin');
//   if (loginBtn) {
//     loginBtn.style.display = 'none';
//   }

//   // Muestra el botón de logout si existe
//   const logoutBtn = document.getElementById('btnLogout');
//   if (logoutBtn) {
//     logoutBtn.style.display = 'inline-block';
//     logoutBtn.addEventListener('click', () => {
//       sessionStorage.clear(); // borra token, rol, id
//       window.location.href = 'login.html'; // redirige al login
//     });
//   }
// }
//----------------------------------
const token = sessionStorage.getItem('token');

const loginBtn = document.getElementById('btnLogin');
const logoutBtn = document.getElementById('btnLogout');

if (token) {
  // Oculta el botón de login
  if (loginBtn) loginBtn.style.display = 'none';

  // Muestra el botón de logout
  if (logoutBtn) {
    logoutBtn.style.display = 'inline-block';
    logoutBtn.addEventListener('click', () => {
      sessionStorage.clear();
      window.location.reload(); // recarga la cartelera como visitante
    });
  }
} else {
  // Muestra el botón de login
  if (loginBtn) loginBtn.style.display = 'inline-block';

  // Oculta el botón de logout
  if (logoutBtn) logoutBtn.style.display = 'none';
}

// === CARGAR CARTELERA DESDE EL BACKEND ===
async function loadBillboard() {
  try {
    const res = await fetch("http://localhost:3000/api/shows"); // GET al backend
    const data = await res.json();

    console.log("Respuesta del backend:", data);

    allShows = data.body || [];

    list.innerHTML = ""; // Limpia resultados previos
    allShows.forEach(createCard); // Crea una card por espectáculo
  } catch (error) {
    console.error("Error al cargar la cartelera:", error);
    list.innerHTML = "<p>Error al cargar los espectáculos.</p>";
  }
}

// === CREAR CADA TARJETA ===
function createCard(show) {
  const clone = template.content.cloneNode(true); // Clonamos el template

  // Completamos los datos dinámicos
  clone.querySelector(".title").textContent = show.title;
  clone.querySelector(".mode").textContent = show.mode;

  // Fecha en formato local (Argentina)
  const date = new Date(show.date).toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  clone.querySelector(".date").textContent = date;

  clone.querySelector(".place").textContent = show.place;
  clone.querySelector(".description").textContent =
    show.description || "Sin descripción disponible";

  // Imagen (flyer o placeholder)
  const img = clone.querySelector("img");
  img.src = show.flyer
    ? show.flyer
    : "https://via.placeholder.com/400x200?text=Sin+imagen";
  img.alt = `Flyer del espectáculo ${show.title}`;

  // Guardamos modalidad como atributo
  clone.querySelector(".card").setAttribute("data-mode", show.mode.toLowerCase());

  // Botón "Ver más" → abre modal con detalle
  const btn = clone.querySelector(".btn-see-more");
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    showDetail(show);
  });

  list.appendChild(clone);
}

// === MODAL (DETALLE DEL ESPECTÁCULO) ===
const modal = document.getElementById("detailModal");
const closeModalBtn = document.getElementById("closeModal");

// Muestra el detalle del espectáculo en el modal
function showDetail(show) {
  document.getElementById("modalTitle").textContent = show.title;
  document.getElementById("modalDate").textContent = new Date(show.date).toLocaleString(
    "es-AR",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }
  );
  document.getElementById("modalPlace").textContent = show.place;
  document.getElementById("modalDescription").textContent =
    show.description || "Sin descripción disponible";
  document.getElementById("modalCategory").textContent = show.mode;
  document.getElementById("modalLink").href = show.link || "#";

  // Mostrar artista (nombre y link si existe)
  const artistName = show.artist_name || "—";
  const artistLink = document.getElementById("modalArtist");
  artistLink.textContent = artistName;

  if (show.artist_id) {
    artistLink.href = `artist-profile.html?id=${show.artist_id}`;
  } else {
    artistLink.removeAttribute("href");
  }

  modal.style.display = "flex"; // Muestra el modal
}

// Cerrar modal (botón X o click afuera)
closeModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});

// === FUNCIÓN DE BÚSQUEDA ===
// Normaliza texto (elimina tildes y pasa a minúsculas)
function normalize(text) {
  return text
    ? text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    : "";
}

// Filtra los espectáculos según el texto buscado
function filterShows() {
  const term = normalize(document.getElementById("search-input").value.trim());

  list.innerHTML = "";

  if (term === "") {
    allShows.forEach(createCard);
    return;
  }

  const filtered = allShows.filter(
    (show) =>
      normalize(show.title).includes(term) ||
      normalize(show.place).includes(term) ||
      normalize(show.description).includes(term)
  );

  if (filtered.length > 0) {
    filtered.forEach(createCard);
  } else {
    list.innerHTML = "<p>No se encontraron resultados.</p>";
  }
}

// === EVENTOS ===
document.getElementById("search-btn").addEventListener("click", filterShows);
document.getElementById("search-input").addEventListener("input", filterShows);
document.getElementById("search-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    filterShows();
  }
});

window.filterShows = filterShows; // Evita errores si el botón la llama antes de que cargue el DOM

// === INICIO ===
document.addEventListener("DOMContentLoaded", loadBillboard);
