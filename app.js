const express = require('express'); //Framework del servidor 
const app = express();
const cors = require('cors');
const mysql = require('mysql2'); //Librería para la manipulación de la base de datos
const path = require('path');
require('dotenv').config();
const PORT = 3000;

// Middleware para manejar solicitudes JSON
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Crear la conexión a la base de datos
/*
Para más seguridad puedes generar un archivo .env con el siguiente contenido

DB_HOST=Cambiar por el puerto donde está guardada la base de datos
DB_USER=Cambiar por el usuario de la base de datos
DB_PASSWORD=Cambiar por la contraseña de la base de datos
DB_NAME=Cambiar por el nombre de la base de datos

Si se realiza esto debes dejar tal y como está el const connection = mysql.createConnection que es lo que está justo debajo, pero caso contrario cambia por la información solicitada en los comentarios
*/
const connection = mysql.createConnection({
    host: process.env.DB_HOST, //Cambiar por el puerto donde está guardada la base de datos
    user: process.env.DB_USER, // Cambiar por el usuario de la base de datos
    password: process.env.DB_PASSWORD, //Cambiar por la contraseña de la base de datos
    database: process.env.DB_NAME //Cambiar por el nombre de la base de datos
});

// Conectar a la base de datos
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);// Mensaje de error en la conexión
        return;
    }
    console.log('Connected to database');// Mensaje de éxito en la conexión
});

// Ruta principal para renderizar el archivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));// Renderizar el archivo index HTML
});

// Ruta para obtener datos de la base de datos
//Puedes ver los datos en formato JSON de la base de datos solo agregando /consulta al final de la URL
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
            const matchData = results[0]; // Devuelve solo el primer campo encontrado
            res.json({ match: true, data: matchData });
        } else {
            res.json({ match: false, data: null }); // No se encontraron coincidencias
        }
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor Express en funcionamiento en http://localhost:${PORT}`);// Mensaje con la ruta del servidor
});