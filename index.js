// Først bruker vi 'require' for å referere til Express-biblioteket
//  (som ligger i node_modules):
const express = require('express');

// Deretter lager vi en ny instans av Express:
const app = express();

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

// Så starter vi serveren, som nå lytter på port 3000:
app.listen(3000, () => {
 console.log('Server listening on port 3000');
});