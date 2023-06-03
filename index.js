const https = require('https');
const fs = require('fs');
const express = require('express');
const app = express();
const ytdl = require('ytdl-core');

const options = {
    key: fs.readFileSync('private.key'),
    cert: fs.readFileSync('certificate.crt')
};

app.get('/watch', async (req, res) => {
    const url = `https://youtube.com/watch?v=${req.query.v}`; // получаем URL видео из запроса

    if (!url || !ytdl.validateURL(url)) {
        res.status(400).send('Неверный URL видео');
        return;
    }

    try {
        const info = await ytdl.getInfo(url); // получаем информацию о видео
        const video = ytdl(url, { quality: 'highest' }); // создаем поток для скачивания видео
        console.log(info.videoDetails.title)
        res.header('Content-Disposition', `attachment; filename="${encodeURI(info.videoDetails.title)}.mp4"`);
        video.pipe(res); // отправляем данные клиенту
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка загрузки видео');
    }
});

https.createServer(options, app).listen(process.env.PORT || 3000, () => {
    console.log('Сервер запущен на порту 3000');
});
