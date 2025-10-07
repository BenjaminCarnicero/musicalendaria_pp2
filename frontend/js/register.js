document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('formRegister');
    const registerMessage = document.getElementById('register-message');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
//variable name posible error
        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const rol = document.getElementById('rol').value;

        const userData = { nombre, email, password, rol };

        try {
          
            const res = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            const data = await res.json();
            console.log('Registro:', data);

            if (res.ok) {
                registerMessage.style.color = 'green';
                registerMessage.textContent = data.message;

                // Limpiar formulario
                registerForm.reset();
            } else {
                registerMessage.style.color = 'red';
                registerMessage.textContent = data.message || 'Error en el registro.';
            }
        } catch (err) {
            console.error('Error al registrar:', err);
            registerMessage.style.color = 'red';
            registerMessage.textContent = 'Error de conexión con el servidor.';
        }
    });
});
