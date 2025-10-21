// cartelera.js
async function cargarEventos() {
  try {
    const res = await fetch('http://localhost:3000/api/eventos');
    const eventos = await res.json();

    const contenedor = document.getElementById('eventos');
    contenedor.innerHTML = eventos.map(e => `
      <div style="margin-bottom:20px; padding:10px; background:#f0f0f0; border-radius:8px; color:#000;">
        <h3>${e.nombre}</h3>
        <p><strong>Fecha:</strong> ${e.fecha} ${e.hora}</p>
        <p><strong>Lugar:</strong> ${e.lugar}</p>
        <p><strong>Entrada:</strong> ${e.modalidad} ${e.precio ? `- $${e.precio}` : ''}</p>
        ${e.flyer ? `<a href="${e.flyer}" target="_blank">Ver flyer</a>` : ''}
        ${e.artistaId ? `<br><a href="artista.html?id=${e.artistaId}">Ver perfil del artista</a>` : ''}
      </div>
    `).join('');
  } catch (err) {
    console.error('Error al cargar eventos:', err);
    document.getElementById('eventos').innerHTML = '<p>No se pudo cargar la cartelera.</p>';
  }
}

cargarEventos();