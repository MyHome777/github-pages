// Aquí puedes agregar funcionalidades interactivas más adelante si es necesario  
console.log("Página cargada correctamente");  
async function obtenerLetra(artista, cancion) {  
    try {  
        const respuesta = await fetch(`https://api.lyrics.ovh/v1/${artista}/${cancion}`);  
        const data = await respuesta.json();  
        console.log(data);
        if (data.lyrics) {  
            document.getElementById('letra').innerText = data.lyrics;  
        } else {  
            document.getElementById('letra').innerText = 'Letra no encontrada.';  
        }  
    } catch (error) {  
        console.error('Error al obtener la letra:', error);  
        document.getElementById('letra').innerText = 'Ocurrió un error al buscar la letra.';  
    }  
}  

// Manejar el evento de enviar el formulario  
document.getElementById('buscador').addEventListener('submit', function (e) {  
    e.preventDefault();  
    const artista = document.getElementById('artista').value;  
    const cancion = document.getElementById('cancion').value;  
    obtenerLetra(artista, cancion);  
});  
