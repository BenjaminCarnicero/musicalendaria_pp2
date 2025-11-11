// dashboard.js
// Este script maneja el panel del artista (dashboard): muestra sus datos y controla el cierre de sesión.

console.log("🎯 Validando sesión...", {
  token: localStorage.getItem('token'),
  artistaId: localStorage.getItem('artistaId')
});

// Una vez verificado, cargamos el contenido
document.addEventListener('DOMContentLoaded', async () => {

  // Verificación de sesión
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  const artistId = localStorage.getItem('artistaId');

  console.log("Token:", token);
  console.log("Rol:", userRole);
  console.log("Artista ID:", artistId);

  if (!token || userRole !== 'artist' || !artistId) {
    window.location.href = "login.html";
  }

  try {
    const res = await fetch(`http://localhost:3000/api/artists/${artistId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await res.json();

    if (res.ok && data.body) {
      const artist = data.body;
      document.getElementById('artistName').textContent = artist.nombre || "Artista sin nombre";
      document.getElementById('artistEmail').textContent = artist.email || "";
      const photoEl = document.getElementById('artistPhoto');
        if (artist.foto) {
          photoEl.src = artist.foto;
          photoEl.classList.remove('hidden');
        } else {
          photoEl.classList.add('hidden');
        }
      // Mostrar nombre y foto en la barra superior
      const miniPerfil = document.getElementById('miniPerfil');
      miniPerfil.innerHTML = `
      <img src="${artist.foto || '../assets/default-avatar.png'}" alt="Perfil">
      <span>${artist.nombre || 'Artista'}</span>`;

      // Botón para abrir el formulario de edición
      document.getElementById('editProfileBtn').addEventListener('click', () => {
      document.getElementById('editProfileSection').classList.remove('hidden');

      // Precargar datos reales del artista
      document.getElementById('editBio').value = artist.bio || '';
      document.getElementById('editInstagram').value = artist.instagram || '';
      document.getElementById('editSpotify').value = artist.spotify || '';
      document.getElementById('editAppleMusic').value = artist.apple_music || '';
      document.getElementById('editYouTube').value = artist.youtube_channel || '';
      document.getElementById('editFoto').value = artist.foto || '';
    });

    // Botón para cancelar edición
    document.getElementById('cancelEditBtn').addEventListener('click', () => {
      document.getElementById('editProfileSection').classList.add('hidden');
    });

    

    // Enviar cambios al backend con validación visual
  document.getElementById('editProfileForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const bio = document.getElementById('editBio').value.trim();
    const instagram = document.getElementById('editInstagram').value.trim();
    const spotify = document.getElementById('editSpotify').value.trim();
    const apple_music = document.getElementById('editAppleMusic').value.trim();
    const youtube_channel = document.getElementById('editYouTube').value.trim();
    const foto = document.getElementById('editFoto').value.trim();
    const messageBox = document.getElementById('editProfileMessage');

    // Validación básica
    if (!bio || !foto) {
      messageBox.textContent = "⚠️ La biografía y la foto son obligatorias.";
      messageBox.classList.remove('success');
      return;
    }

    messageBox.textContent = "Guardando cambios...";
    messageBox.classList.remove('success');

    const body = { bio, instagram, foto, spotify, apple_music, youtube_channel };

    try {
      const res = await fetch(`http://localhost:3000/api/artists/${artistId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (res.ok && !data.error) {
  messageBox.textContent = "✅ Perfil actualizado correctamente.";
  messageBox.classList.add('success');

      // Actualizar visualmente el dashboard sin recargar
      document.getElementById('artistName').textContent = body.nombre || "Artista sin nombre";
      document.getElementById('artistEmail').textContent = body.bio || "";
      document.getElementById('artistPhoto').src = body.foto || '../assets/default-avatar.png';

      const miniPerfil = document.getElementById('miniPerfil');
      miniPerfil.innerHTML = `
        <img src="${body.foto || '../assets/default-avatar.png'}" alt="Perfil">
        <span>${body.nombre || 'Artista'}</span>
      `;

      const linksContainer = document.getElementById('artistLinks');
      linksContainer.innerHTML = ""; // Limpiar antes de renderizar
      let hayRedes = false;

      redes.forEach(red => {
        if (red.url) {
          hayRedes = true;
          const a = document.createElement('a');
          a.href = red.url.startsWith('http') ? red.url : `https://${red.url}`;
          a.target = "_blank";
          a.rel = "noopener noreferrer";
          a.textContent = red.label;
          a.classList.add('social-link');
          linksContainer.appendChild(a);
        }
      });

      if (!hayRedes) {
        linksContainer.innerHTML = "<p class='empty'>No hay redes sociales cargadas.</p>";
      }

      const redes = [
        { label: "Instagram", url: artist.instagram },
        { label: "Spotify", url: artist.spotify },
        { label: "Apple Music", url: artist.apple_music },
        { label: "YouTube", url: artist.youtube_channel }
      ];

      redes.forEach(red => {
        if (red.url) {
          const a = document.createElement('a');
          a.href = red.url.startsWith('http') ? red.url : `https://${red.url}`;
          a.target = "_blank";
          a.rel = "noopener noreferrer";
          a.textContent = red.label;
          a.classList.add('social-link');
          linksContainer.appendChild(a);
        }
      });

      // Ocultar el formulario
      document.getElementById('editProfileSection').classList.add('hidden');
    }
    else {
        messageBox.textContent = "❌ No se pudo actualizar el perfil.";
      }
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
      messageBox.textContent = "❌ Error de conexión con el servidor.";
    }
  });
    } else {
      throw new Error(data.error || "No se pudo cargar el perfil del artista");
    }

  } catch (error) {
    console.error("Error al cargar el dashboard:", error);
    alert("Error al cargar los datos del artista.");
  }

  // Botón de cerrar sesión
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.clear(); // ✅ borra todo
    window.location.href = "login.html";
  });

  // Boton Mostrar formulario de nueva presentación
  document.getElementById('newShowBtn').addEventListener('click', () => {
    document.getElementById('newShowSection').classList.remove('hidden');
  });

  // Boton de cancelar creación
  document.getElementById('cancelNewShowBtn').addEventListener('click', () => {
    document.getElementById('newShowSection').classList.add('hidden');
  });

    document.getElementById('newShowForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const titulo = document.getElementById('newShowTitle').value.trim();
    const fecha = document.getElementById('newShowDate').value;
    const lugar = document.getElementById('newShowPlace').value.trim();
    const messageBox = document.getElementById('newShowMessage');

    if (!titulo || !fecha || !lugar) {
      messageBox.textContent = "⚠️ Todos los campos son obligatorios.";
      messageBox.classList.remove('success');
      return;
    }

    messageBox.textContent = "Creando presentación...";
    messageBox.classList.remove('success');

    try {
      const res = await fetch(`http://localhost:3000/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ titulo, fecha, lugar, artista_id: artistId })
      });

      const data = await res.json();
      if (res.ok && !data.error) {
        messageBox.textContent = "✅ Presentación creada.";
        messageBox.classList.add('success');

        const li = document.createElement('li');
        li.innerHTML = `
          <strong>${titulo}</strong> – ${new Date(fecha).toLocaleDateString('es-AR')} – ${lugar}
          <button class="btn edit-show" data-id="${data.body.id}">Editar</button>
          <button class="btn delete-show" data-id="${data.body.id}">Eliminar</button>
        `;
        document.getElementById('shows').appendChild(li);
        assignPresentationListeners();

        document.getElementById('newShowForm').reset();
        document.getElementById('newShowSection').classList.add('hidden');
      } else {
        messageBox.textContent = "❌ No se pudo crear.";
      }
    } catch (err) {
      console.error("Error al crear presentación:", err);
      messageBox.textContent = "❌ Error de conexión.";
    }
  });


  document.getElementById('editShowForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('editShowId').value;
  const titulo = document.getElementById('editShowTitle').value.trim();
  const fecha = document.getElementById('editShowDate').value;
  const lugar = document.getElementById('editShowPlace').value.trim();
  const messageBox = document.getElementById('editShowMessage');

  if (!titulo || !fecha || !lugar) {
    messageBox.textContent = "⚠️ Todos los campos son obligatorios.";
    messageBox.classList.remove('success');
    return;
  }

  messageBox.textContent = "Guardando cambios...";
  messageBox.classList.remove('success');

  try {
    const res = await fetch(`http://localhost:3000/api/events/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ titulo, fecha, lugar })
    });

    const data = await res.json();
    if (res.ok && !data.error) {
      messageBox.textContent = "✅ Presentación actualizada.";
      messageBox.classList.add('success');

      const li = document.querySelector(`.edit-show[data-id="${id}"]`)?.parentElement;
      if (li) {
        li.innerHTML = `
          <strong>${titulo}</strong> – ${new Date(fecha).toLocaleDateString('es-AR')} – ${lugar}
          <button class="btn edit-show" data-id="${id}">Editar</button>
          <button class="btn delete-show" data-id="${id}">Eliminar</button>
        `;
      }

      assignPresentationListeners();
      document.getElementById('editShowSection').classList.add('hidden');
    } else {
      messageBox.textContent = "❌ No se pudo actualizar.";
    }
  } catch (err) {
    console.error("Error al actualizar presentación:", err);
    messageBox.textContent = "❌ Error de conexión.";
  }
});

const perfilMsg = document.getElementById('perfilStatus');
if (!artist.bio || !artist.foto) {
  perfilMsg.textContent = "⚠️ Tu perfil está incompleto. Completalo para que se vea mejor.";
  perfilMsg.classList.remove('hidden');
} else {
  perfilMsg.classList.add('hidden');
}
// Botón para ver presentaciones del artista con edición y eliminación
document.getElementById('viewShowsBtn')?.addEventListener('click', async () => {
  const showsSection = document.getElementById('showsList');
  const showsList = document.getElementById('shows');

  showsSection.classList.remove('hidden');
  showsList.innerHTML = "";

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
        li.innerHTML = `
          <strong>${show.titulo}</strong> – ${new Date(show.fecha).toLocaleDateString('es-AR')} – ${show.lugar}
          <button class="btn edit-show" data-id="${show.id}">Editar</button>
          <button class="btn delete-show" data-id="${show.id}">Eliminar</button>
        `;
        showsList.appendChild(li);
        assignPresentationListeners();
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

function assignPresentationListeners() {
  // Listener para eliminar presentaciones
  document.querySelectorAll('.delete-show').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      if (confirm("¿Seguro que querés eliminar esta presentación?")) {
        try {
          const res = await fetch(`http://localhost:3000/api/events/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          if (res.ok && !data.error) {
            alert("✅ Presentación eliminada");
            btn.parentElement.remove();
          } else {
            alert("❌ No se pudo eliminar");
          }
        } catch (err) {
          console.error("Error al eliminar presentación:", err);
          alert("❌ Error de conexión");
        }
      }
    });
  });

  // Listener para editar presentaciones
  document.querySelectorAll('.edit-show').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const li = btn.parentElement;
      const [titleRaw, dateRaw, placeRaw] = li.textContent.split(" – ");

      document.getElementById('editShowSection').classList.remove('hidden');
      document.getElementById('editShowId').value = id;
      document.getElementById('editShowTitle').value = titleRaw.trim();
      document.getElementById('editShowDate').value = new Date(dateRaw.trim()).toISOString().split("T")[0];
      document.getElementById('editShowPlace').value = placeRaw.trim();
    });
  });
}