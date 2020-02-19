require('dotenv').config();
const express = require('express');
const weather = require('./weather.js');
const request = require('superagent');
const app = express();

app.get('/', (req, res) => res.send('Jello World!'));

let latitude;
let longitude;

app.get('/location', async(req, res, next) => {
    try {
        const location = req.query.search;
        const URL = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${location}&format=json`;
        const data = await request.get(URL);
        const firstLocation = data.body[0];
        

        latitude = firstLocation.lat;
        longitude = firstLocation.lon;
    
        res.json({
            formattedQuery: firstLocation.display_name,
            latitude: latitude,
            longitude: longitude
        });
    } catch (err) {
        next(err);
    }
});

const getWeatherData = (latitude, longitude) => {
    return weather.daily.data.map(forecast => {
        return {
            forecast: forecast.summary,
            time: new Date(forecast.time * 1000)
        };
    });
};

app.get('/weather', (require, respond) => {
    const portlandWeather = getWeatherData(latitude, longitude);

    respond.json({ portlandWeather });
});

module.exports = { app };