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
        console.log(translit(info.videoDetails.title))
        res.header('Content-Disposition', `attachment; filename="${translit(info.videoDetails.title)}.mp4"`);
        video.pipe(res); // отправляем данные клиенту
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка загрузки видео');
    }
});

function translit(word) {
    var answer = '';
    var converter = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
        'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i',
        'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
        'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
        'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch',
        'ш': 'sh', 'щ': 'sch', 'ь': '', 'ы': 'y', 'ъ': '',
        'э': 'e', 'ю': 'yu', 'я': 'ya',

        'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D',
        'Е': 'E', 'Ё': 'E', 'Ж': 'Zh', 'З': 'Z', 'И': 'I',
        'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N',
        'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T',
        'У': 'U', 'Ф': 'F', 'Х': 'H', 'Ц': 'C', 'Ч': 'Ch',
        'Ш': 'Sh', 'Щ': 'Sch', 'Ь': '', 'Ы': 'Y', 'Ъ': '',
        'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
    };

    for (var i = 0; i < word.length; ++i) {
        if (converter[word[i]] == undefined) {
            answer += word[i];
        } else {
            answer += converter[word[i]];
        }
    }

    return removeInvalidChars(answer);
}

function removeInvalidChars(s) {
    const withEmojis = /\p{Extended_Pictographic}/ug
    return s.replaceAll(withEmojis, '');
}

https.createServer(options, app).listen(process.env.PORT || 3000, () => {
    console.log('Сервер запущен на порту 3000');
});
