async function obtenerLetra(artista, cancion) {  
    try {  
        // Obtener letra desde la API de letras  
        const respuesta = await fetch(`https://api.lyrics.ovh/v1/${artista}/${cancion}`);  
        const data = await respuesta.json();  

        if (data.lyrics) {  
            // Mostrar letra  
            document.getElementById('letra').innerText = data.lyrics;  
        } else {  
            document.getElementById('letra').innerText = 'Letra no encontrada.';  
        }  

        // Buscar video en YouTube  
        const key = 'AlzaSyD4svuUO1QZ_SD3KCz1WdYHmVfiDSL40Z4';  
        const youtubeResponse = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(artista + ' ' + cancion)}&key=${key}`);  
        const youtubeData = await youtubeResponse.json();  

        if (youtubeData.items.length > 0 && youtubeData.items[0].id.videoId) {  
            const videoId = youtubeData.items[0].id.videoId;  
            document.getElementById('video').innerHTML = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;  
        } else {  
            document.getElementById('video').innerText = 'Video no encontrado.';  
        }  

    } catch (error) {  
        console.error('Error al obtener la letra o el video:', error);  
        document.getElementById('letra').innerText = 'Ocurrió un error al buscar la letra.';  
        document.getElementById('video').innerText = 'Ocurrió un error al buscar el video.';  
    }  
}  

// Manejar el evento en el formulario  
document.getElementById('buscador').addEventListener('submit', function (e) {  
    e.preventDefault();  
    const artista = document.getElementById('artista').value;  
    const cancion = document.getElementById('cancion').value;  
    obtenerLetra(artista, cancion);  
});  
