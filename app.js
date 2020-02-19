const express = require('express');
// const data = require('./geo.js');
const weather = require('./weather.js');
const app = express();
const request = require('superagent');

let latitude;
let longitude;

app.get('/', (req, res) => res.send('Jello World!'));

app.get('/location', async(req, res, next) => {
    try {
        const location = req.query.search;
        const URL = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${location}&format=json`;
        const cityData = await request.get(URL);
        const firstLocation = cityData.body[0];

        latitude = firstLocation.lat;
        longitude = firstLocation.lon;
    
        res.json({
            formattedQuery: cityData.formatted_address,
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