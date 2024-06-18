const jugadores = JSON.parse(localStorage.getItem('jugadores')) || [];

// Función para agregar jugador con imagen
function agregarJugador() {
    const apellido = document.getElementById('apellido').value;
    const nombre = document.getElementById('nombre').value;
    let dni = document.getElementById('dni').value.trim();
    const pais = document.getElementById('pais-nacimiento').value;
    const fechaNacimiento = document.getElementById('fecha-nacimiento').value;
    const imagen = document.getElementById('imagen-previa').src;

    // Validar campos obligatorios
    if (!apellido || !nombre || !dni || !pais || !fechaNacimiento || !imagen || imagen === '#') {
        Swal.fire(
            'Error',
            'Debe completar todos los campos obligatorios, incluyendo la imagen.',
            'error'
        );
        return;
    }

    const dniRepetido = jugadores.some(jugador => jugador.dni === dni);
    if (dniRepetido) {
        Swal.fire(
            'Error',
            'Ya existe un jugador con ese DNI.',
            'error'
        );
        return;
    }

    // Validar longitud exacta del DNI
    if (dni.length !== 8) {
        Swal.fire(
            'Error',
            'El DNI debe tener exactamente 8 números.',
            'error'
        );
        return;
    }

    // Validar que el DNI contenga solo números
    if (!/^\d+$/.test(dni)) {
        Swal.fire(
            'Error',
            'El DNI debe contener solo números.',
            'error'
        );
        return;
    }

    const edad = calcularEdad(fechaNacimiento);
    const jugador = {
        apellido: apellido,
        nombre: nombre,
        dni: dni,
        pais: pais,
        fechaNacimiento: fechaNacimiento,
        edad: edad,
        imagen: imagen 
    };

    jugadores.push(jugador);
    localStorage.setItem('jugadores', JSON.stringify(jugadores));
    Swal.fire(
        '¡Jugador agregado!',
        'El jugador ha sido agregado correctamente.',
        'success'
    ).then(() => {
        document.getElementById('apellido').value = '';
        document.getElementById('nombre').value = '';
        document.getElementById('dni').value = '';
        document.getElementById('pais-nacimiento').value = '';
        document.getElementById('fecha-nacimiento').value = '';
        document.getElementById('imagen-previa').src = '#';
        mostrarJugadoresAgregados();
    });
}

// Función para mostrar la imagen seleccionada antes de agregar al jugador
document.getElementById('imagen-jugador').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        document.getElementById('imagen-previa').src = e.target.result;
        document.getElementById('imagen-previa').style.display = 'block';
    };

    reader.readAsDataURL(file);
});

function calcularEdad(fechaNacimiento) {
    const hoy = new Date();
    const fechaNac = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
        edad--;
    }
    return edad;
}

// Función para ver información de un jugador
function verInformacionDelantero() {
    const dni = document.getElementById('dni-buscar').value.trim();
    if (!dni) {
        Swal.fire(
            'Error',
            'Ingrese un DNI para buscar al jugador.',
            'error'
        );
        return;
    }
    const jugadorEncontrado = jugadores.find(jugador => jugador.dni.toLowerCase() === dni.toLowerCase());
    if (jugadorEncontrado) {
        Swal.fire({
            title: `${jugadorEncontrado.nombre} ${jugadorEncontrado.apellido}`,
            html: `
                <p><strong>DNI:</strong> ${jugadorEncontrado.dni}</p>
                <p><strong>País de nacimiento:</strong> ${jugadorEncontrado.pais}</p>
                <p><strong>Fecha de nacimiento:</strong> ${jugadorEncontrado.fechaNacimiento}</p>
                <p><strong>Edad:</strong> ${jugadorEncontrado.edad}</p>
                <p><strong>Goles:</strong> ${jugadorEncontrado.goles}</p>
            `,
            icon: 'info'
        });
    } else {
        Swal.fire(
            'Error',
            'No se encontró ningún jugador con ese DNI.',
            'error'
        );
    }
}

// Función para marcar que un jugador se retira
function jugadorSeRetira() {
    const dni = document.getElementById('dni-se-va').value.trim();
    if (!dni) {
        Swal.fire(
            'Error',
            'Ingrese el DNI para marcar al jugador que se retira.',
            'error'
        );
        return;
    }
    const jugadorIndex = jugadores.findIndex(jugador => jugador.dni.toLowerCase() === dni.toLowerCase());
    if (jugadorIndex !== -1) {
        jugadores.splice(jugadorIndex, 1);
        localStorage.setItem('jugadores', JSON.stringify(jugadores));
        Swal.fire(
            'Hecho',
            `El jugador con el DNI: ${dni} se Retira. Le Deseamos Mucha Suerte y Felicidad!!.`,
            'success'
        ).then(() => {
            mostrarJugadoresAgregados(); // Opcional: actualizar la lista de jugadores mostrados
        });
    } else {
        Swal.fire(
            'Error',
            'No se encontró ningún jugador con ese DNI.',
            'error'
        );
    }
}

// Función para agregar goles a un jugador
function agregarGolesDelantero() {
    const dni = document.getElementById('dni-goles').value.trim();
    const cantidadGoles = parseInt(document.getElementById('cantidad-goles').value);
    if (!dni || isNaN(cantidadGoles)) {
        Swal.fire(
            'Error',
            'Ingrese un DNI y una cantidad válida de goles.',
            'error'
        );
        return;
    }
    const jugadorIndex = jugadores.findIndex(jugador => jugador.dni.toLowerCase() === dni.toLowerCase());
    if (jugadorIndex !== -1) {
        // Actualizar la cantidad de goles del jugador
        jugadores[jugadorIndex].goles = jugadores[jugadorIndex].goles ? jugadores[jugadorIndex].goles + cantidadGoles : cantidadGoles;
        localStorage.setItem('jugadores', JSON.stringify(jugadores));
        Swal.fire(
            'Hecho',
            `${cantidadGoles} goles han sido agregados a ${dni}.`,
            'success'
        ).then(() => {
            mostrarJugadoresAgregados(); // Opcional: actualizar la lista de jugadores mostrados
        });
    } else {
        Swal.fire(
            'Error',
            'No se encontró ningún jugador con ese DNI.',
            'error'
        );
    }
}

function mostrarJugadoresAgregados() {
    const container = document.getElementById('jugadores-container');
    container.innerHTML = '';
    jugadores.forEach(jugador => {
        const jugadorCard = document.createElement('div');
        jugadorCard.classList.add('jugador-card');
        jugadorCard.innerHTML = `
            <h2>${jugador.nombre} ${jugador.apellido}</h2>
            <p><strong>DNI:</strong> ${jugador.dni}</p>
            <p><strong>País de nacimiento:</strong> ${jugador.pais}</p>
            <p><strong>Fecha de nacimiento:</strong> ${jugador.fechaNacimiento}</p>
            <p><strong>Edad:</strong> ${jugador.edad}</p>
            ${jugador.goles ? `<p><strong>Goles:</strong> ${jugador.goles}</p>` : ''}
            <button onclick="eliminarJugador('${jugador.dni}')">Eliminar</button>
            <button onclick="editarJugador('${jugador.dni}')">Editar</button>
        `;
        container.appendChild(jugadorCard);
    });
}



