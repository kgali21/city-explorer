const express = require('express');
const data = require('./geo.js');
const app = express();
// const request = require('superagent');

console.log(data);

app.get('/', (request, respond) => respond.send('Jello World!'));

app.get('/location', (request, respond) => {
    const cityData = data.results[0];

    respond.json({
        formattedQuery: cityData.formatted_address,
        latitude: cityData.geometry.location.lat,
        longitude: cityData.geometry.location.lng
    });
});

module.exports = { app };