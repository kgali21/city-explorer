const express = require('express');
const data = require('./geo.js');
const weather = require('./weather.js');
const app = express();
// const request = require('superagent');

let lat;
let lng;

app.get('/', (request, respond) => respond.send('Jello World!'));

app.get('/location', (request, respond) => {
    const cityData = data.results[0];

    lat = cityData.geometry.location.lat;
    lng = cityData.geometry.location.lng;

    respond.json({
        formattedQuery: cityData.formatted_address,
        latitude: lat,
        longitude: lng
    });
});

const getWeatherData = (lat, lng) => {
    return weather.daily.data.map(forecast => {
        return {
            forecast: forecast.summary,
            time: new Date(forecast.time * 1000)
        };
    });
};

app.get('/weather', (require, respond) => {
    const portlandWeather = getWeatherData(lat, lng);

    respond.json({ portlandWeather });
});

module.exports = { app };