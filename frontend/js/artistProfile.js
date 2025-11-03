// Esperamos a que cargue todo el contenido del documento
document.addEventListener('DOMContentLoaded', async () => {

  // Obtenemos el parámetro "id" del artista desde la URL
  // Ejemplo: artistProfile.html?id=3 → artistaId = 3
  const params = new URLSearchParams(window.location.search);
  const artistaId = params.get('id');

  // Si no hay un ID, mostramos un mensaje de error
  if (!artistaId) {
    document.body.innerHTML = "<p>Artista no especificado.</p>";
    return;
  }

  try {
    // 1️ Solicitamos los datos del artista al backend
    const res = await fetch(`http://localhost:3000/api/artistas/${artistaId}`);
    const data = await res.json();

    // Si hay error o el cuerpo está vacío, lanzamos una excepción
    if (data.error || !data.body.length) throw new Error("No se encontró el artista");

    // Extraemos el artista de la respuesta
    const artista = data.body[0];

    // 2️ Mostramos los datos en el HTML
    document.getElementById('nombre').textContent = artista.nombre;
    document.getElementById('bio').textContent = artista.bio || "Sin biografía disponible.";
    document.getElementById('instagram').href = artista.instagram || "#";
    document.getElementById('twitter').href = artista.twitter || "#";
    document.getElementById('spotify').href = artista.spotify || "#";
    document.getElementById('youtube').href = artista.youtube || "#";

    // Si el artista tiene foto, la mostramos
    if (artista.foto) {
      document.getElementById('fotoPerfil').src = artista.foto;
    } else {
      // Imagen por defecto si no tiene foto
      document.getElementById('fotoPerfil').src = "../img/default-artist.jpg";
    }

    // 3️ Solicitamos los shows del artista
    const resShows = await fetch(`http://localhost:3000/api/espectaculos/por-artista/${artistaId}`);
    const showsData = await resShows.json();

    // Obtenemos el contenedor donde se mostrarán las presentaciones
    const lista = document.getElementById('presentaciones');

    // Si hay shows, los recorremos y los mostramos
    if (!showsData.error && Array.isArray(showsData.body) && showsData.body.length > 0) {
      showsData.body.forEach(show => {
        const li = document.createElement('li');
        // Mostramos el título, fecha y lugar
        li.textContent = `${show.titulo} – ${new Date(show.fecha).toLocaleDateString('es-AR')} – ${show.lugar}`;
        lista.appendChild(li);
      });
    } else {
      // Si no hay shows, mostramos un mensaje
      lista.innerHTML = "<li>No hay presentaciones programadas.</li>";
    }

  } catch (err) {
    // Si ocurre algún error, lo mostramos en consola y en pantalla
    console.error("Error cargando el perfil:", err);
    document.body.innerHTML = "<p>Error cargando el perfil del artista.</p>";
  }
});
