const express = require('express')
const app = express();

app.get("/watch", (req, res) => {
    return res.redirect(`https://work.220youtube.ru/youtube/${req.query['v']}/download/22?title=test`);
})
app.listen(process.env.port, () =>
    console.log(`Example app listening on port ${process.env.port}!`),
);