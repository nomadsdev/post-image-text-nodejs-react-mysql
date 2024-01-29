const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'post_image_text_db'
});

db.connect((err) => {
    if (err) {
        console.error('Error connection to database');
    } else {
        console.log('Connected to database');
    }
});

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
}).single('image');

app.post('/posts', upload, (req, res) => {
    const { text } = req.body;
    const image = req.file.filename;

    const sql = 'INSERT INTO posts (text, image) VALUES (?, ?)';
    db.query(sql, [text, image], (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, text, image });
    });
});

app.get('/posts', (req, res) => {
    const sql = 'SELECT * FROM posts';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.delete('/posts/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM posts WHERE id = ?';
    db.query(sql, id, (err, result) => {
        if (err) throw err;
        res.json({ message: 'Post deleted successfully' });
    });
});

app.listen(port, () => {
    console.log('Server is running');
});