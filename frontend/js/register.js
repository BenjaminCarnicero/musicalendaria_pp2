// Escucha el evento "submit" del formulario de registro
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault(); // evita que el formulario recargue la página

  // Obtiene los valores ingresados por el usuario
  const nombre = document.getElementById('nombre').value.trim();
  const usuario = document.getElementById('usuario').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const rol = document.getElementById('rol').value;

  // Valida que todos los campos estén completos
  if (!nombre || !usuario || !email || !password || !rol) {
    document.getElementById('registerMessage').textContent = "Por favor, completá todos los campos.";
    return;
  }

  try {
    // Envía los datos al backend en formato JSON
    const res = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, usuario, email, password, rol }) // cuerpo de la petición
    });

    // Convierte la respuesta del backend a formato JSON
    const data = await res.json();

    // Verifica si hubo error o si se registró correctamente
    if (res.ok) {
      // Éxito → muestra mensaje y redirige al login
      document.getElementById('registerMessage').textContent = data.body || "Registro exitoso.";
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1000);
    } else {
      // Error → muestra mensaje del backend o genérico
      document.getElementById('registerMessage').textContent = data.error || "Error al registrarse.";
    }

  } catch (error) {
    // Captura errores de red o del servidor
    console.error("Error en el registro:", error);
    document.getElementById('registerMessage').textContent = "Error en la conexión al servidor.";
  }
});
