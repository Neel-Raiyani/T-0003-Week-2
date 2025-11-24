const express = require('express');
const multer = require('multer');
const morgan = require('morgan');

const app = express();
const PORT = 3018;

// Morgan logger
app.use(morgan('dev'));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage })

app.get('/', (req, res) => {
    res.send("This is a test route");
});


app.post('/upload', upload.single('image'), (req,res) => {
    res.json({
        message: "File uploaded successfully!!!",
        file: req.file
    })
});

// Route for throwing error
app.get('/error', (req, res, next) => {
    const err = new Error("Something went wrong!!!");
    err.statusCode = 500; 
    next(err);
});
// Centralized error handling middleware
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error!!!"
  });
});

app.listen(PORT,() => {
    console.log(`Server running on "http://localhost:${PORT}"`);
})