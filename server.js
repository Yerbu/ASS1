const express = require('express');
const path = require('path');
const axios = require('axios');
const bodyParser = require('body-parser');
const moment = require('moment');
const dotenv = require('dotenv');
const app = express();
const port = 3000;

const tourHistory = [];

app.use(express.static('public'));

app.get('/routes/travelRoutes.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'routes', 'travelRoutes.js'));
});

dotenv.config();

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/travelagency', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'travelagency.html'));
});

app.post('/travelagency', async (req, res) => {
    try {
        const tourCost = calculateTourCost(req.body);
        const weatherApiKey = process.env.OPENWEATHERMAP_API_KEY;
        const weatherResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${req.body.city}&appid=${weatherApiKey}&units=metric`
        );
        const weatherConditions = weatherResponse.data.weather[0].description;

        const timestamp = moment().format('MMMM Do YYYY, h:mm:ss a');
        const tourResult = {
            tour: req.body,
            cost: tourCost,
            weather: {
                temperature: weatherResponse.data.main.temp,
                conditions: weatherConditions,
            },
            timestamp: timestamp,
        };

        console.log('Tour Result:', tourResult);

        tourHistory.push(tourResult);

        res.json({ success: true, message: 'Tour booked successfully', tourResult });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error processing the tour request' });
    }
});

app.get('/tourhistory', (req, res) => {
    res.json({ success: true, tourHistory });
});

app.get('/getWeather', async (req, res) => {
    try {
        const city = req.query.city;
        const weatherApiKey = process.env.OPENWEATHERMAP_API_KEY;
        const weatherResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`
        );

        res.json(weatherResponse.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching weather information' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
