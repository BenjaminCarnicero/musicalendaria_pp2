// Escucha el evento "submit" del formulario de login
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault(); // evita que el formulario recargue la página

  // Toma los valores ingresados
  const usuario = document.getElementById('loginUsuario').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  // Verifica que ambos campos estén completos
  if (!usuario || !password) {
    document.getElementById('loginMessage').textContent = "Por favor, completá todos los campos.";
    return;
  }

  try {
    // Envía los datos al backend para autenticar
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, password }) // permite usar usuario o email
    });

    // Convierte la respuesta del backend en JSON
    const data = await res.json();

    // Si la respuesta es correcta
    if (res.ok) {
      // Guarda el token y el ID del usuario en sessionStorage (o localStorage si preferís mantener la sesión)
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('userId', data.id);
      sessionStorage.setItem('userRole', data.rol);

      // Muestra mensaje de éxito
      document.getElementById('loginMessage').textContent = "Sesión iniciada. Redirigiendo...";

      // Redirige al dashboard o página principal
      setTimeout(() => {
        window.location.href = 'billboard.html';
      }, 1000);
    } else {
      // Si hay error, muestra mensaje del backend o uno genérico
      document.getElementById('loginMessage').textContent = data.error || "Credenciales incorrectas.";
    }

  } catch (error) {
    // Captura errores de conexión o servidor
    console.error("Error al iniciar sesión:", error);
    document.getElementById('loginMessage').textContent = "Error en la conexión al servidor.";
  }
});
