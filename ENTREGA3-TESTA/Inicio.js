let usuariosRegistrados = JSON.parse(localStorage.getItem('usuarios')) || [];

function mostrarRegistro() {
    document.getElementById('registro-form').style.display = 'block';
    document.getElementById('inicio-sesion-form').style.display = 'none';
}

function mostrarInicioSesion() {
    document.getElementById('inicio-sesion-form').style.display = 'block';
    document.getElementById('registro-form').style.display = 'none';
}

function validarEmailUnico(email) {
    return usuariosRegistrados.every(usuario => usuario.email !== email);
}

function registrarUsuario(event) {
    event.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    // Validar longitud mínima de la contraseña
    if (password.length < 8) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'La contraseña debe tener al menos 8 caracteres.',
        });
        return;
    }
    if (nombre === '' || email === '' || password === '') {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, complete todos los campos.',
        });
        return;
    }
    if (!validarEmailUnico(email)) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ya existe un usuario registrado con este correo electrónico.',
        });
        return;
    }
    // Almacenar usuario en localStorage
    usuariosRegistrados.push({ nombre, email, password });
    localStorage.setItem('usuarios', JSON.stringify(usuariosRegistrados));
    // Limpiar campos después del registro
    document.getElementById('nombre').value = '';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: 'Ahora puedes iniciar sesión con tu cuenta.',
    }).then(() => {
        mostrarInicioSesion();
    });
}

function iniciarSesion(event) {
    event.preventDefault();
    const email = document.getElementById('email-login').value.trim();
    const password = document.getElementById('password-login').value.trim();
    // Validar longitud mínima de la contraseña
    if (password.length < 8) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'La contraseña debe tener al menos 8 caracteres.',
        });
        return;
    }
    // Buscar usuario en localStorage
    const usuario = usuariosRegistrados.find(u => u.email === email && u.password === password);
    if (usuario) {
        Swal.fire({
            icon:'success',
            title:'Inicio de sesión exitoso',
            text:'¡Bienvenido de nuevo!',
        }).then(() => {
            window.location.href = 'GoalMakers Agency.html'; 
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Correo electrónico o contraseña incorrectos. Inténtalo de nuevo.',
        });
    }

    // Limpiar campos después del inicio de sesión
    document.getElementById('email-login').value = '';
    document.getElementById('password-login').value = '';
}

// Agregar listeners a los formularios
document.getElementById('registro-form').addEventListener('submit', registrarUsuario);
document.getElementById('inicio-sesion-form').addEventListener('submit', iniciarSesion);

