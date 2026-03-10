// Først bruker vi 'require' for å referere til Express-biblioteket
//  (som ligger i node_modules):
const express = require('express');
const { Pool } = require("pg");

const app = express();

// PostgreSQL connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "testdb",
  password: "mysecretpassword",
  port: 5432,
});

// Route to create table and insert users
app.get("/setup-users", async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100)
      );
    `);

    await pool.query(`
      INSERT INTO users (name) VALUES
        ('Joe Biden'),
        ('Donald Trump'),
        ('Kamala Harris');
    `);

    res.send("Users table created and data inserted!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

// Vi setter opp en enkel "rute" (route) som svarer på
// forespørsler til rotkatalogen, /:
app.get('/her', (req, res) => {
  res.send(`<h1>Hallo, Klokken er ${new Date().toLocaleTimeString()}</h1>
  <button onclick="window.location.href='/'">Tilbake til hjemmesiden</button>
  `);
});

app.get('/', (req, res) => {
  res.send(`
  <h1>Velkommen til min hjemmeside!</h1> 
  <p>Dette er en enkel Express-server som viser en klokkebeskjed.</p>
  <div class="buttons">
    <button onclick="window.location.href='/her'">Gå til klokkebeskjed</button>
    <button onclick="window.location.href='/klasskamerater'">Se klasskamerater</button>
    <button onclick="window.location.href='/api'">Se api</button>
  </div>
  <style>
    .buttons {
      margin-top: 20px;
      width: 10%;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    button {
      padding: 5px;
      font-size: 16px;
    }
  </style>
  `);
  res.redirect('/'); // Om du vil omdirigere til rotkatalogen etter å ha vist denne siden
});

app.get('/klasskamerater', (req, res) => {
  res.send(`
  <h1>Klasskamerater</h1>
  <p>Her er en liste over mine klasskamerater:</p>
  <ul>
    <li>Victor</li>
    <li>Kevin</li>
    <li>Lars</li>
  </ul>
  <button onclick="window.location.href='/'">Tilbake til hjemmesiden</button>
  `);
});

app.get('/api', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
  
  res.send('<button onclick="window.location.href=' /'">Tilbake til hjemmesiden</button>')
});

// Så starter vi serveren, som nå lytter på port 3000:
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});