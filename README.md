# Proyecto de Express con MySQL

Este proyecto utiliza Express, MySQL y otras dependencias para configurar un servidor y conectarse a una base de datos MySQL.

## Requisitos previos

- Node.js (versión 12 o superior)
- MySQL (decarga desde su pag)
- Git (opcional)

## Base de datos

[Instalar MySQL(mac)](https://www.youtube.com/watch?v=-3KBIEraskU&ab_channel=GroverTec)

[Instalar MySQL(windows)](https://www.youtube.com/watch?v=DoUrxEsbV8Y&ab_channel=GroverTec)

Generar una base de datos nueva en mySQL

```sql
CREATE DATABASE `tu_base_de_datos`;
```

Dentro de la carpeta "query" se encuetra un archivo llamado mySQL.sql

copiar el contenido y ejecutarlo.

## Instalación

1. Instala las dependencias del proyecto desde la terminal:

   ```bash
   npm install
   npm install express
   npm install mysql2
   npm install cors
   npm install dotenv
   ```
2. Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido, ajustando los valores según tu configuración de MySQL:

   ```plaintext
   DB_HOST=localhost
   DB_USER=tu_usuario
   DB_PASSWORD=tu_contraseña
   DB_NAME=tu_base_de_datos
   ```

   Puedes crear este archivo automáticamente usando el siguiente comando en Unix (Linux/Mac) o en Git Bash en Windows:

   ```bash
   echo -e "DB_HOST=localhost\nDB_USER=tu_usuario\nDB_PASSWORD=tu_contraseña\nDB_NAME=tu_base_de_datos" > .env
   ```

## Uso

1. Inicia el servidor ejecuta desde la termianl:

   ```bash
   npm start
   ```

   El servidor estará disponible en `http://localhost:3000`.

## Dependencias

- [Express](https://expressjs.com/)
- [MySQL2](https://www.npmjs.com/package/mysql2)
- [cors](https://www.npmjs.com/package/cors)
- [dotenv](https://www.npmjs.com/package/dotenv)

## Código de Ejemplo

El siguiente es un ejemplo básico del código de configuración del servidor:

```javascript
const express = require('express'); //Framework del servidor 
const app = express();
const cors = require('cors');
const mysql = require('mysql2'); //Librería para la manipulación de la base de datos
const path = require('path');
require('dotenv').config();
const PORT = 3000;

// Configuración de CORS
app.use(cors());

// Configuración de body parser para JSON
app.use(express.json());

// Conexión a la base de datos
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Ruta de ejemplo
app.get('/', (req, res) => {
    res.send('¡Hola, mundo!');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
```
