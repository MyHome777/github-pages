const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
const app = express();

app.use(cors({ origin: '*' }));

// --- RUTA PRINCIPAL ---
app.get('/', (req, res) => {
    res.send('Servidor Meewor activo 🚀');
});

// --- EL DESPERTADOR (PING) ---
// Esta es la ruta que visitaremos cada 14 minutos para engañar a Render
app.get('/ping', (req, res) => {
    res.status(200).send('Estoy despierto 😎');
});

// --- RUTA DE DESCARGA REAL ---
app.get('/download', async (req, res) => {
    try {
        const videoURL = req.query.url;
        
        if (!ytdl.validateURL(videoURL)) {
            return res.status(400).send('URL no válida');
        }

        const info = await ytdl.getInfo(videoURL);
        const title = info.videoDetails.title.replace(/[^\w\s]/gi, 'video');

        res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);

        ytdl(videoURL, {
            format: 'mp4',
            quality: 'lowest' 
        }).pipe(res);

    } catch (error) {
        console.error(error);
        res.status(500).send('Error: ' + error.message);
    }
});

// En Render usamos process.env.PORT, si no existe usamos 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`);
});

