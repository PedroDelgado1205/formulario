const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');
require('dotenv').config();
const PORT = 3000;

// Middleware para manejar solicitudes JSON
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Crear la conexión a la base de datos
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Conectar a la base de datos
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database');
});

// Ruta principal para servir el archivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para obtener datos de la base de datos
app.get('/consulta', (req, res) => {
    connection.query('SELECT * FROM consulta', (error, results) => {
        if (error) {
            console.error('Error querying database:', error);
            res.status(500).json({ error: 'Error querying database' });
            return;
        }
        res.json(results);
    });
});

// Ruta para comparar los datos del formulario con la base de datos
app.post('/comparar-datos', (req, res) => {
    const { numero, codigo, fecha } = req.body;
    connection.query('SELECT * FROM consulta WHERE numero_legalizacion = ? AND codigo_verificacion = ? AND fecha_emision = ?', [numero, codigo, fecha], (error, results) => {
        if (error) {
            console.error('Error querying database:', error);
            res.status(500).json({ error: 'Error querying database' });
            return;
        }
        if (results.length > 0) {
            // Si hay resultados, devolver los datos encontrados
            const matchData = results[0]; // Supongamos que solo necesitas el primer resultado
            res.json({ match: true, data: matchData });
        } else {
            res.json({ match: false, data: null }); // No se encontraron coincidencias
        }
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor Express en funcionamiento en http://localhost:${PORT}`);
});