// Esperamos a que el formulario se envie
document.getElementById('loginForm').addEventListener('submit', async function(event) {
  event.preventDefault(); // Evitamos el envio tradicional del formulario

  // Obtenemos los valores del input
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    // Enviamos los datos al backend por POST a la ruta /login
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }) // Enviamos email y password como JSON
    });

    const data = await response.json(); // Esperamos la respuesta en JSON

    if (response.ok) {
      // Si todo salio bien, guardamos el token en sessionStorage
      sessionStorage.setItem('token', data.token);
      alert('Login exitoso');
      
      // window.location.href = 'dashboard.html';
    } else {
      // Si hubo un error, mostramos el mensaje
      alert(data.message || 'Error al iniciar sesión');
    }

  } catch (error) {
    console.error('Error en el login:', error);
    alert('Hubo un problema al conectar con el servidor');
  }
});
