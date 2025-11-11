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
    // Guarda los datos en localStorage
  localStorage.setItem('token', data.body.token);
  localStorage.setItem('artistaId', data.body.id); // ahora id es el artistaId
  localStorage.setItem('userRole', data.body.rol); // ✅ esto es clave
  

  console.log("✅ Datos guardados en localStorage:", {
    token: localStorage.getItem('token'),
    userId: localStorage.getItem('userId'),
    userRole: localStorage.getItem('userRole'),
    artistaId: localStorage.getItem('artistaId')
  });

  document.getElementById('loginMessage').textContent = "Sesión iniciada. Redirigiendo...";

  // Redirige según el rol
  setTimeout(() => {
    if (data.rol === 'artist') {
      window.location.href = 'dashboard.html';
    } else {
      window.location.href = 'billboard.html';
    }
  }, 1000);
} else {
  document.getElementById('loginMessage').textContent = data.error || "Credenciales incorrectas.";
}


  } catch (error) {
    // Captura errores de conexión o servidor
    console.error("Error al iniciar sesión:", error);
    document.getElementById('loginMessage').textContent = "Error en la conexión al servidor.";
  }
});
