const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const app = express();

// En HF a veces es necesario configurar CORS para aceptar cualquier origen
app.use(cors({ origin: '*' })); 

app.get('/ping', (req, res) => {
    res.status(200).send('Servidor despierto 😎');
});

app.get('/', (req, res) => {
    res.send('El servidor está vivo. Usa /download?url=... para descargar.');
});

app.get('/download', async (req, res) => {
    try {
        const videoURL = req.query.url;
        
        if (!ytdl.validateURL(videoURL)) {
            return res.status(400).send('URL no válida');
        }

        const info = await ytdl.getInfo(videoURL);
        // Limpiamos el título para evitar caracteres raros
        const title = info.videoDetails.title.replace(/[^\w\s]/gi, 'video');

        res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);

        ytdl(videoURL, {
            format: 'mp4',
            quality: 'lowest' // Usar 'lowest' en HF Free para evitar timeouts de CPU
        }).pipe(res);

    } catch (error) {
        console.error(error);
        res.status(500).send('Error: ' + error.message);
    }
});

// ESCUCHAR EN EL PUERTO 7860
const port = 7860;
app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`);
});