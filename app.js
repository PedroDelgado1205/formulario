const express = require('express'); //framework del servidor 
const app = express();
const cors = require('cors');
const mysql = require('mysql2'); //libreria para la manipulacion de la base de datos
const path = require('path');
require('dotenv').config();
const PORT = 3000;

// Middleware para manejar solicitudes JSON
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Crear la conexión a la base de datos
/*
para mas seguridad puedes generar un arvhivo .env con la siguiente configuracion

DB_HOST=cambiar por el puerto donde esta guardada la base de datos
DB_USER=cambiar por el usuario de la base de datos
DB_PASSWORD=cambiar por la contraseña de la base de datos
DB_NAME=cambiar por el nombre de la base de datos

si se realiza esto debes dejar tal y como esta el const connection = mysql.createConnection que es lo que esta justo abajo 
*/
const connection = mysql.createConnection({
    host: process.env.DB_HOST, //cambiar por el puerto donde esta guardada la base de datos
    user: process.env.DB_USER, // cambiar por el usuario de la base de datos
    password: process.env.DB_PASSWORD, //cambiar por la contraseña de la base de datos
    database: process.env.DB_NAME //cambiar por el nombre de la base de datos
});

// Conectar a la base de datos
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);//mensaje de error en la conxion
        return;
    }
    console.log('Connected to database');//mensaje de exito en la conxion
});

// Ruta principal para servir el archivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));//rederixar el archivo index HTML
});

// Ruta para obtener datos de la base de datos
//puedes ver los datos de la base de datos solo agregando /consulta al final de la url
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
            const matchData = results[0]; // devuelve solo el primer campo encontrado
            res.json({ match: true, data: matchData });
        } else {
            res.json({ match: false, data: null }); // No se encontraron coincidencias
        }
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor Express en funcionamiento en http://localhost:${PORT}`);//ruta del servidor
});