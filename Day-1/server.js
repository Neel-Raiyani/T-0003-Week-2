const express = require('express');
const app = express();

const PORT = 3018;

app.get('/', (req, res) => {
    res.send("Hello");
})

app.listen(PORT,() => {
    console.log(`App running on "http://localhost:${PORT}"`);
})