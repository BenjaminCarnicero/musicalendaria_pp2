async function registrar() {
  const payload = {
    nombre: document.getElementById('nombre').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
    rol: document.getElementById('rol').value
  };
  console.log({payload});
  if (!payload.nombre || !payload.email || !payload.password || !payload.rol) {
    alert('Por favor completá todos los campos');
    return;
  }

  const res = await fetch('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (res.ok) {
    alert('Registro exitoso');
    window.location.href = 'login.html';
  } else {
    alert(data.error || 'Error al registrarse');
  }
}