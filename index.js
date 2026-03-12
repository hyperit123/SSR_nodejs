// Først bruker vi 'require' for å referere til Express-biblioteket
//  (som ligger i node_modules):
const express = require('express');
const { Pool } = require("pg");

const app = express();
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'mydb',
  password: process.env.DB_PASSWORD || 'mysecretpassword',
  port: process.env.DB_PORT || 5432,
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

    // skuespiller TABLE
    await pool.query(`
      CREATE TABLE IF NOT EXISTS skuespiller (
        id SERIAL PRIMARY KEY,
        navn VARCHAR(100) UNIQUE
      );
    `);

    const skuespillerCheck = await pool.query(`SELECT COUNT(*) FROM skuespiller`);

    if (parseInt(skuespillerCheck.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO skuespiller (navn) VALUES
          ('Keanu Reeves'),
          ('Laurence Fishburne'),
          ('Carrie-Anne Moss');
      `);
      console.log("Initial skuespillere inserted");
    } else {
      console.log("Skuespillere already exist, skipping insert");
    }

    // filmer_skuespiller TABLE
    await pool.query(`
      CREATE TABLE IF NOT EXISTS filmer_skuespiller (
        id SERIAL PRIMARY KEY,
        film_id INTEGER REFERENCES filmer(id),
        skuespiller_id INTEGER REFERENCES skuespiller(id)
      );
    `);

    const filmerSkuespillerCheck = await pool.query(`SELECT COUNT(*) FROM filmer_skuespiller`);

    if (parseInt(filmerSkuespillerCheck.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO filmer_skuespiller (film_id, skuespiller_id) VALUES
          (1, 1), -- The Matrix - Keanu Reeves
          (2, 1), -- The Matrix Reloaded - Keanu Reeves
          (3, 1), -- The Matrix Revolutions - Keanu Reeves
          (1, 2), -- The Matrix - Laurence Fishburne
          (2, 2), -- The Matrix Reloaded - Laurence Fishburne
          (3, 2), -- The Matrix Revolutions - Laurence Fishburne
          (1, 3), -- The Matrix - Carrie-Anne Moss
          (2, 3), -- The Matrix Reloaded - Carrie-Anne Moss
          (3, 3); -- The Matrix Revolutions - Carrie-Anne Moss
      `);
      console.log("Initial filmer_skuespiller relationships inserted");
    } else {
      console.log("Filmer_skuespiller relationships already exist, skipping insert");
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
  <p>Dette er nettside med en Express-server som viser en alle oppgaven som blir gjort.</p>
  <div class="buttons">
    <button style="grid-column: 1/ span2;" onclick="window.location.href='/her'">Gå til klokkebeskjed</button>
    <button onclick="window.location.href='/klasskamerater'">Se klasskamerater</button>
    <button onclick="window.location.href='/deltagere-json'">Se deltagere i JSON</button>
    <button onclick="window.location.href='/deltagere.html'">Se deltagere i HTML</button>
    <button onclick="window.location.href='/hi.html'">Gå til hi.html</button>
    <button style="grid-column: 5/ span2;" onclick="window.location.href='/deltagere.html'">Gå til deltagere.html</button>
    <button onclick="window.location.href='/bilmerker'">Se bilmerker i HTML</button>
    <button style="grid-column: 2/ span2;" onclick="window.location.href='/bilmerker-json'">Se bilmerker i JSON</button>
    <button onclick="window.location.href='/filmer_skuespiller'">Se filmer og skuespillere</button>
    <button onclick="window.location.href='/filmer_skuespiller-json'">Se filmer og skuespillere i JSON</button>
    <button onclick="window.location.href='/filmer_skuespiller-json.html'">Se filmer og skuespillere i JSON (HTML)</button>
    <button onclick="window.location.href='/skuespiller.html'">Se skuespillere i HTML</button>
  </div>
  <style>
    .buttons {
      margin-top: 20px;
      width: 10%;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 10px;
    }
    button {
      padding: 5px;
      font-size: 16px;
      width: 200px;
      margin: 20px 0;
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

app.get('/filmer_skuespiller', async (req, res) => {
  const result = await pool.query(`
    SELECT f.tittel, s.navn
    FROM filmer_skuespiller fs
    JOIN filmer f ON fs.film_id = f.id
    JOIN skuespiller s ON fs.skuespiller_id = s.id
  `);

  let html = "<h1>Filmer og Skuespillere</h1><ul>";
  for (const row of result.rows) {
    html += `<li>${row.tittel} - ${row.navn}</li>`;
  }
  html += "</ul><button onclick=\"window.location.href='/'\">Tilbake til hjemmesiden</button>";
  res.send(html);
});

app.get('/filmer_skuespiller-json', async (req, res) => {
  const result = await pool.query(`
    SELECT f.tittel, s.navn
    FROM filmer_skuespiller fs
    JOIN filmer f ON fs.film_id = f.id
    JOIN skuespiller s ON fs.skuespiller_id = s.id
  `);
  res.json(result.rows);
});

app.post('/deltagere', async (req, res) => {
  const data = req.body;
  console.log('Lagrer deltager: ', data)
  const query = 'INSERT INTO users (name) VALUES ($1)';
  const values = [data.name];
  await pool.query(query, values);
  console.log('Lagret deltager: ', data)
  res.send('Data lagret');
});

app.get('/skuespillere', async (req, res) => {
  const result = await pool.query('SELECT * FROM skuespiller');
  res.json(result.rows);
});

app.post('/skuespillere', async (req, res) => {
  const data = req.body;
  console.log('Lagrer skuespiller: ', data)
  const query = 'INSERT INTO skuespiller (navn) VALUES ($1)';
  const values = [data.navn];
  await pool.query(query, values);
  console.log('Lagret skuespiller: ', data)
  res.send('Data lagret');
});

// Så starter vi serveren, som nå lytter på port 3000:
app.listen(3000, () => {
  console.log('Serveren kjører på http://localhost:3000');
});