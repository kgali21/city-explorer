require('dotenv').config();
const express = require('express');
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

const getWeatherData = async(latitude, longitude) => {
    const URL = `https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}/${latitude},${longitude}`;
    const data = await request.get(URL);

    return data.body.daily.data.map(forecast => {
        return {
            forecast: forecast.summary,
            time: new Date(forecast.time * 1000)
        };
    });
};

app.get('/weather', async(req, res, next) => {
    try {
        const locationWeather = await getWeatherData(latitude, longitude);

        res.json({ locationWeather });
    } catch (err) {
        next(err);
    }
});

const getTrailsData = async(latitude, longitude) => {
    const URL = `https://www.hikingproject.com/data/get-trails?lat=${latitude}&lon=${longitude}&maxResults=10&key=${process.env.TRAILS_API_KEY}`;
    const data = await request.get(URL);
    console.log(data);
    return data.body.trails.map(trail => {
        return {
            name: trail.name,
            location: trail.location,
            length: trail.length,
            stars: trail.stars,
            star_votes: trail.starVotes,
            summary: trail.summary,
            trail_url: trail.url,
            conditions: trail.conditionStatus,
            condition_date: trail.conditionDate
        };
    });
};

app.get('/trails', async(req, res, next) => {
    try {
        const locationTrails = await getTrailsData(latitude, longitude);

        res.json({ locationTrails });
    } catch (err) {
        next(err);
    }
});

module.exports = { app };