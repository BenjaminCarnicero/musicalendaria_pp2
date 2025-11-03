// dashboard.js
// Este script maneja el panel del artista (dashboard): muestra sus datos y controla el cierre de sesión.

document.addEventListener('DOMContentLoaded', async () => {
  // Tomamos el token y el ID del artista del localStorage (guardados al hacer login)
  const token = localStorage.getItem('token');
  const artistId = localStorage.getItem('artistaId');

  // Si no hay sesión activa, redirige al login
  if (!token || !artistId) {
    window.location.href = "login.html";
    return;
  }

  try {
    // Petición al backend para obtener los datos del artista
    const res = await fetch(`http://localhost:3000/api/artists/${artistId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await res.json();

    if (res.ok && data.body) {
      const artist = data.body;

      // Mostramos los datos del artista en pantalla
      document.getElementById('artistName').textContent = artist.nombre || "Artista sin nombre";
      document.getElementById('artistEmail').textContent = artist.email || "";
      if (artist.foto) document.getElementById('artistPhoto').src = artist.foto;
    } else {
      throw new Error(data.error || "No se pudo cargar el perfil del artista");
    }

  } catch (error) {
    console.error("Error al cargar el dashboard:", error);
    alert("Error al cargar los datos del artista.");
  }

  // Botón de cerrar sesión
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('artistaId');
    window.location.href = "login.html";
  });

  // Botón para ver presentaciones del artista
  document.getElementById('viewShowsBtn')?.addEventListener('click', async () => {
    const showsSection = document.getElementById('showsList');
    const showsList = document.getElementById('shows');

    showsSection.classList.remove('hidden');
    showsList.innerHTML = ""; // limpia la lista

    try {
      const res = await fetch(`http://localhost:3000/api/events/by-artist/${artistId}`);
      const data = await res.json();

      if (res.ok && Array.isArray(data.body)) {
        if (data.body.length === 0) {
          showsList.innerHTML = "<li>No tenés presentaciones registradas.</li>";
          return;
        }

        data.body.forEach(show => {
          const li = document.createElement('li');
          li.textContent = `${show.titulo} – ${new Date(show.fecha).toLocaleDateString('es-AR')} – ${show.lugar}`;
          showsList.appendChild(li);
        });
      } else {
        showsList.innerHTML = "<li>Error al obtener tus presentaciones.</li>";
      }
    } catch (error) {
      console.error("Error al obtener presentaciones:", error);
      showsList.innerHTML = "<li>Error al conectar con el servidor.</li>";
    }
  });
});
