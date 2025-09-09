// dashboard.js

// 1. Leer el token desde sessionStorage
const token = sessionStorage.getItem('token');

// 2. Si no hay token, redireccionar al login
if (!token) {
  alert('Debes iniciar sesión primero');
  window.location.href = 'login.html';
}

// 3. Hacer la peticion al backend para obtener los datos del usuario
fetch('http://localhost:3000/perfil', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
  .then(response => {
    if (!response.ok) {
      throw new Error('Token inválido o expirado');
    }
    return response.json();
  })
  .then(data => {
    // 4. Mostrar los datos del usuario en el <p id="infoUsuario">
    const info = `Nombre: ${data.nombre} - Email: ${data.email}`;
    document.getElementById('infoUsuario').textContent = info;
  })
  .catch(error => {
    console.error(error);
    alert('Sesión inválida. Iniciá sesión nuevamente.');
    window.location.href = 'login.html';
  });

// 5. Cerrar sesion: limpiar el token y volver al login
document.getElementById('cerrarSesion').addEventListener('click', () => {
  sessionStorage.removeItem('token');
  window.location.href = 'login.html';
});
