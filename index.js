// Først bruker vi 'require' for å referere til Express-biblioteket
//  (som ligger i node_modules):
const express = require('express');
const { Pool } = require("pg");

const app = express();

// PostgreSQL connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "mysecretpassword",
  port: 5432,
});

// Route to create table and insert users
// run once on server start
async function setupDatabase() {
  try {

    // USERS TABLE
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE
      );
    `);

    const usersCheck = await pool.query(`SELECT COUNT(*) FROM users`);

    if (parseInt(usersCheck.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO users (name) VALUES
          ('Joe Biden'),
          ('Donald Trump'),
          ('Kamala Harris');
      `);
      console.log("Initial users inserted");
    } else {
      console.log("Users already exist, skipping insert");
    }


    // BILMERKER TABLE
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bilmerker (
        id SERIAL PRIMARY KEY,
        merke VARCHAR(100) UNIQUE
      );
    `);

    const bilmerkerCheck = await pool.query(`SELECT COUNT(*) FROM bilmerker`);

    if (parseInt(bilmerkerCheck.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO bilmerker (merke) VALUES
          ('Toyota'),
          ('BMW'),
          ('Mercedes'),
          ('Audi'),
          ('Tesla');
      `);
      console.log("Initial bilmerker inserted");
    } else {
      console.log("Bilmerker already exist, skipping insert");
    }

    // Filmer TABLE
    await pool.query(`
      CREATE TABLE IF NOT EXISTS filmer (
        id SERIAL PRIMARY KEY,
        tittel VARCHAR(100) UNIQUE
      );
    `);

    const filmerCheck = await pool.query(`SELECT COUNT(*) FROM filmer`);

    if (parseInt(filmerCheck.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO filmer (tittel) VALUES
          ('The Matrix'),
          ('The Matrix Reloaded'),
          ('The Matrix Revolutions');
      `);
      console.log("Initial filmer inserted");
    } else {
      console.log("Filmer already exist, skipping insert");
    }

  } catch (err) {
    console.error("Database setup error:", err);
  }
}

// call it when starting the server
setupDatabase();

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
    <button onclick="window.location.href='/deltagere-json'">Se deltagere i JSON</button>
    <button onclick="window.location.href='/deltagere-2'">Se deltagere i HTML</button>
    <button onclick="window.location.href='/hi.html'">Gå til hi.html</button>
    <button onclick="window.location.href='/deltagere.html'">Gå til deltagere.html</button>
    <button onclick="window.location.href='/bilmerker'">Se bilmerker i HTML</button>
    <button onclick="window.location.href='/bilmerker-json'">Se bilmerker i JSON</button>
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

app.get('/deltagere-json', async (req, res) => {
  const result = await pool.query('SELECT * FROM users');
  res.json(result.rows);
});

app.get('/deltagere-2', async (req, res) => {
  // Henter data fra databasen:
  const result = await pool.query('SELECT * FROM users');

  // Starter en html-liste:
  let html = "<h1>Deltagere</h1>"
  html += "<ul>"

  // Legger til en <li> for hver rad i databasen:
  for (const row of result.rows) {
    html += "</li><li>" + row.name + "</li>"
  }

  // Avslutter html-listen og returnerer resultatet:
  html += "</ul>"

  html += "<button onclick=\"window.location.href='/'\">Tilbake til hjemmesiden</button>"
  res.send(html);
});

app.use(express.static('public'));

app.get('/bilmerker', async (req, res) => {
  const result = await pool.query('SELECT * FROM bilmerker');
  let html = "<h1>Bilmerker</h1><ul>";
  for (const row of result.rows) {
    html += `<li>${row.merke}</li>`;
  }
  html += "</ul><button onclick=\"window.location.href='/'\">Tilbake til hjemmesiden</button>";
  res.send(html);
});

app.get('/bilmerker-json', async (req, res) => {
  const result = await pool.query('SELECT * FROM bilmerker');
  res.json(result.rows);
});

// Så starter vi serveren, som nå lytter på port 3000:
app.listen(3000, () => {
  console.log('Serveren kjører på http://localhost:3000');
});