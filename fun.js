console.log("Página cargada correctamente");

// Base de datos de artistas y canciones para autocompletado
const sugerencias = [
    { artista: "Hillsong Worship", canciones: ["Oceans", "What A Beautiful Name", "So Will I", "Here Again", "Cristo En Mí"] },
    { artista: "Marcos Witt", canciones: ["Sobrenatural", "Grande Eres", "El Nombre De Jesús", "Majestad", "Alabanzas"] },
    { artista: "Jesus Culture", canciones: ["Me Dice Que Me Ama", "Tu Nombre", "Good Good Father", "Here For You"] },
    { artista: "Elevation Worship", canciones: ["Here Again", "Great Are You Lord", "Here For You", "Rescate"] },
    { artista: "David M. Sánchez", canciones: ["Canta Mi Alma", "Mi Vida Eres Tú", "Tu Amor Me Hace Libre"] },
    { artista: "Marcos Brunet", canciones: ["Alabanzas", "Dios Tiene Un Propósito", "Mi Refugio", "Tu Amor", "Vivo Estás"] },
    { artista: "Hillsong United", canciones: ["Oceans", "So Will I", "Jesús", "Cristo En Mí", "What A Beautiful Name"] },
    { artista: "Chris Tomlin", canciones: ["Good Good Father", "How Great Is Our God", "Reckless Love", "10,000 Reasons"] },
    { artista: "Matt Redman", canciones: ["10,000 Reasons", "Blessed Be Your Name", "You Never Let Go"] },
    { artista: "Cory Asbury", canciones: ["Reckless Love", "All Yours", "Bless A King"] }
];


// Evento para abrir el menú en móvil
document.querySelector('.nav-toggle').addEventListener('click', function() {
    document.querySelector('.nav-mobile').classList.toggle('show');
});

// Función para obtener la letra
async function obtenerLetra(artista, cancion) {
    try {
        // Mostrar mensaje de carga
        document.getElementById('letra').innerHTML = '<div class="cargando">Cargando...</div>';
        
        // Temporizador de carga
        const timeout = setTimeout(() => {
            document.getElementById('letra').innerHTML = '<div class="cargando">La búsqueda está tardando más de lo normal...</div>';
        }, 3000);

        const respuesta = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artista)}/${encodeURIComponent(cancion)}`);
        clearTimeout(timeout);
        
        const data = await respuesta.json();
        console.log(data);
        
        if (data.lyrics) {
            // Formatear la letra para que se vea mejor
            let letraFormateada = data.lyrics.replace(/\n\n+/g, '\n\n').replace(/\n/g, '<br>');
            
            document.getElementById('letra').innerHTML = `<div class="letra-formateada">${letraFormateada}</div>`;
            document.getElementById('agregarFavorito').style.display = 'inline-block';
            guardarBusqueda(artista, cancion);
        } else {
            document.getElementById('letra').innerHTML = '<div class="no-encontrada">Letra no encontrada.</div>';
            document.getElementById('agregarFavorito').style.display = 'none';
        }
    } catch (error) {
        console.error('Error al obtener la letra:', error);
        document.getElementById('letra').innerHTML = '<div class="error">Ocurrió un error al buscar la letra.</div>';
        document.getElementById('agregarFavorito').style.display = 'none';
    }
}

// Función para guardar búsqueda en historial
function guardarBusqueda(artista, cancion) {
    let historial = JSON.parse(localStorage.getItem('historial')) || [];
    const busqueda = { artista, cancion, fecha: new Date().toLocaleString() };
    
    // Evitar duplicados
    historial = historial.filter(b => !(b.artista === artista && b.cancion === cancion));
    historial.unshift(busqueda);
    
    // Mantener solo las últimas 10 búsquedas
    if (historial.length > 10) historial = historial.slice(0, 10);
    
    localStorage.setItem('historial', JSON.stringify(historial));
    mostrarHistorial();
}

// Función para mostrar historial
function mostrarHistorial() {
    const historial = JSON.parse(localStorage.getItem('historial')) || [];
    const historialDiv = document.getElementById('historial');
    
    if (historial.length > 0) {
        historialDiv.innerHTML = historial.map(b => 
            `<div class="historial-item" onclick="obtenerLetra('${b.artista}', '${b.cancion}')">
                <strong>${b.cancion}</strong><br>
                <small>${b.artista}</small><br>
                <small class="fecha-historial">${b.fecha}</small>
            </div>`
        ).join('');
    } else {
        historialDiv.innerHTML = '<p class="no-datos">No hay búsquedas recientes.</p>';
    }
}

// Función para agregar a favoritos
function agregarFavorito() {
    const artista = document.getElementById('artista').value;
    const cancion = document.getElementById('cancion').value;
    
    if (!artista || !cancion) {
        alert('Primero debes buscar una canción para agregarla a favoritos.');
        return;
    }
    
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    const cancionFav = { artista, cancion };
    
    // Evitar duplicados
    favoritos = favoritos.filter(f => !(f.artista === artista && f.cancion === cancion));
    favoritos.push(cancionFav);
    
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    mostrarFavoritos();
    alert('Canción agregada a favoritos!');
}

// Función para mostrar favoritos
function mostrarFavoritos() {
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    const favoritosDiv = document.getElementById('favoritos');
    
    if (favoritos.length > 0) {
        favoritosDiv.innerHTML = favoritos.map(f => 
            `<div class="favorito-item" onclick="obtenerLetra('${f.artista}', '${f.cancion}')">
                <strong>${f.cancion}</strong><br>
                <small>${f.artista}</small>
            </div>`
        ).join('');
    } else {
        favoritosDiv.innerHTML = '<p class="no-datos">No tienes favoritos aún.</p>';
    }
}

// Función para descargar la letra
function descargarLetra() {
    const letra = document.getElementById('letra').innerText;
    
    if (!letra || letra === 'Cargando...' || letra.includes('búsqueda está tardando') || letra.includes('no encontrada')) {
        alert('No hay letra para descargar.');
        return;
    }
    
    const blob = new Blob([letra], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `letra-${document.getElementById('cancion').value}.txt`;
    a.click();
}

// Manejar el evento de enviar el formulario
document.getElementById('buscador').addEventListener('submit', function (e) {
    e.preventDefault();
    const artista = document.getElementById('artista').value;
    const cancion = document.getElementById('cancion').value;
    obtenerLetra(artista, cancion);
});

// Eventos para los nuevos botones
document.getElementById('descargarLetra').addEventListener('click', descargarLetra);
document.getElementById('agregarFavorito').addEventListener('click', agregarFavorito);

// Cargar historial y favoritos al iniciar
document.addEventListener('DOMContentLoaded', function() {
    mostrarHistorial();
    mostrarFavoritos();
});

// Evento para abrir el menú en móvil
document.querySelector('.nav-toggle').addEventListener('click', function() {
    document.querySelector('.nav-mobile').classList.toggle('show');
});

// Eventos para abrir modales
document.getElementById('favoritos-btn').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('favoritos-modal').style.display = 'block';
});

document.getElementById('historial-btn').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('historial-modal').style.display = 'block';
});

// Eventos para abrir modales en móvil
document.getElementById('favoritos-btn-mobile').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('favoritos-modal').style.display = 'block';
});

document.getElementById('historial-btn-mobile').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('historial-modal').style.display = 'block';
});

// Evento para cerrar modales
document.querySelector('#favoritos-modal .close').addEventListener('click', function() {
    document.getElementById('favoritos-modal').style.display = 'none';
});

document.querySelector('#historial-modal .close').addEventListener('click', function() {
    document.getElementById('historial-modal').style.display = 'none';
});

// Cerrar modal al hacer clic fuera
window.addEventListener('click', function(event) {
    if (event.target == document.getElementById('favoritos-modal')) {
        document.getElementById('favoritos-modal').style.display = 'none';
    }
    if (event.target == document.getElementById('historial-modal')) {
        document.getElementById('historial-modal').style.display = 'none';
    }
});

// Agregar estilos CSS para los nuevos elementos
const style = document.createElement('style');
style.textContent = `
    .cargando {
        color: #4A90E2;
        font-weight: bold;
        text-align: center;
        padding: 1rem;
    }
    
    .no-encontrada, .error {
        color: #FF6B6B;
        text-align: center;
        padding: 1rem;
    }
    
    .no-datos {
        color: rgba(0, 0, 0, 0.5);
        text-align: center;
        padding: 1rem;
        font-style: italic;
    }
    
    .fecha-historial {
        color: rgba(0, 0, 0, 0.5);
        font-size: 0.8rem;
    }
    
    .letra-formateada {
        font-family: 'Georgia', 'Times New Roman', serif;
        font-size: 1.1rem;
        line-height: 2.2;
        text-align: center;
        letter-spacing: 0.5px;
        white-space: pre-wrap;
        word-wrap: break-word;
        padding: 1rem;
    }
    
    @media (max-width: 768px) {
        .letra-formateada {
            font-size: 1rem;
            line-height: 1.8;
        }
    }
`;
document.head.appendChild(style);

console.log("Página cargada correctamente");

console.log("Página cargada correctamente");

// Evento para abrir el menú en móvil
document.querySelector('.nav-toggle').addEventListener('click', function() {
    document.querySelector('.nav-mobile').classList.toggle('show');
});
