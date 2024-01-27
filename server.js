const express = require('express');
const path = require('path');
const axios = require('axios');
const bodyParser = require('body-parser');
const moment = require('moment');
const dotenv = require('dotenv');
const app = express();
const port = 3000;

const tourHistory = [];

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Serve 'travelRoutes.js' from the 'routes' directory
app.get('/routes/travelRoutes.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'routes', 'travelRoutes.js'));
});

// Load environment variables from .env file
dotenv.config();

// Middleware to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route for the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Route for the travel agency page (GET request)
app.get('/travelagency', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'travelagency.html'));
});

app.post('/travelagency', async (req, res) => {
    try {
        // Mock tour calculation logic (replace with your actual logic)
        const tourCost = calculateTourCost(req.body);

        // Call weather API
        const weatherApiKey = process.env.OPENWEATHERMAP_API_KEY;
        const weatherResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${req.body.city}&appid=${weatherApiKey}&units=metric`
        );
        const weatherConditions = weatherResponse.data.weather[0].description;

        // Save tour in history with timestamp
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

        // Log the tour result
        console.log('Tour Result:', tourResult);

        // Add the tour result to the history array
        tourHistory.push(tourResult);

        // Respond with a success message
        res.json({ success: true, message: 'Tour booked successfully', tourResult });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error processing the tour request' });
    }
});

app.get('/tourhistory', (req, res) => {
    res.json({ success: true, tourHistory });
});

// Route to get weather information
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

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
