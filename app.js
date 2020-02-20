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

const getYelpData = async(latitude, longitude) => {
    const URL = `https://api.yelp.com/v3/businesses/search?latitude=${latitude}&longitude=${longitude}`;
    const data = await request
        .get(URL)
        .set('Authorization', `Bearer ${process.env.YELP_API_KEY}`);

    return data.body.businesses.map(business => {
        return {
            name: business.name,
            image_url: business.image_url,
            price: business.price,
            rating: business.rating,
            url: business.url,
        };
    });
};

app.get('/reviews', async(req, res, next) => {
    try {
        const locationBusinesses = await getYelpData(latitude, longitude);
        res.json({ locationBusinesses });
    } catch (err) {
        next(err);
    }
});

const getEventsData = async(latitude, longitude) => {
    const URL = `http://api.eventful.com/json/events/search?app_key=${process.env.EVENTFUL_API_KEY}&where=${latitude},${longitude}&within=25&page_size=20&page_number=1`;
    const data = await request.get(URL);
    const events = JSON.parse(data.text);


    return events.events.event.map(event => {
        return {
            link: event.url,
            name: event.title,
            event_date: event.start_time,
            summary: event.description === null ? 'N/A' : event.description
        };
    });
};

app.get('/events', async(req, res, next) => {
    try {
        const locationEvents = await getEventsData(latitude, longitude);
        res.json({ locationEvents });
    } catch (err) {
        next(err);
    }
});


module.exports = { app };