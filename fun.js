async function obtenerLetra(artista, cancion) {  
    try {  
        key = 'GET /ws/1.1/track.get?';   // Reemplaza con tu clave de API Musixmatch  
        const respuesta = await fetch(`https://api.musixmatch.com/ws/1.1/track.search?q_track=${encodeURIComponent(cancion)}&q_artist=${encodeURIComponent(artista)}&f_has_lyrics=1&apikey=${key}`);  

        if (!respuesta.ok) {  
            console.error('Error en la respuesta de la API:', respuesta.status, respuesta.statusText);  
            throw new Error('Error en la respuesta de la API');  
        }  

        const data = await respuesta.json();  
        console.log('Datos recibidos:', data); // Verifica lo que devuelve la API  

        if (data.message.body.track_list.length > 0) {  
            const trackId = data.message.body.track_list[0].track.track_id;  
            const letraResponse = await fetch(`https://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${trackId}&apikey=${key}`);  
            
            if (!letraResponse.ok) {  
                console.error('Error al obtener la letra:', letraResponse.status, letraResponse.statusText);  
                throw new Error('Error al obtener la letra');  
            }  

            const letraData = await letraResponse.json();  
            const letra = letraData.message.body.lyrics.lyrics_body;  
            document.getElementById('letra').innerText = letra;  
        } else {  
            document.getElementById('letra').innerText = 'Letra no encontrada.';  
        }  
    } catch (error) {  
        console.error('Error al obtener la letra:', error.message);  
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
