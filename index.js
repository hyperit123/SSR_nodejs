// Først bruker vi 'require' for å referere til Express-biblioteket
//  (som ligger i node_modules):
const express = require('express');

// Deretter lager vi en ny instans av Express:
const app = express();

// Vi setter opp en enkel "rute" (route) som svarer på
// forespørsler til rotkatalogen, /:
app.get('/', (req, res) => {
 res.send('Hello, world! Klokken er ' + new Date().toLocaleTimeString());
});

// Så starter vi serveren, som nå lytter på port 3000:
app.listen(3000, () => {
 console.log('Server listening on port 3000');
});