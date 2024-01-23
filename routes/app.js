const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const path = require('path');
const ejs = require('ejs');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.get('/weather', (req, res) => {
    res.sendFile(path.join(publicPath, 'weather.html'));
});

app.get('/dictionary', (req, res) => {
    res.sendFile(path.join(publicPath, 'dictionary.html'));
});

app.get('/translate', (req, res) => {
    res.sendFile(path.join(publicPath, 'translater.html'));
});

app.post('/weather', (req, res) => {
    const city = req.body.city;
    if (!city) {
        return res.send('Please enter a city name.');
    }
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=5b25e4a1213ba1ef21c740e209d2e973`;
    https.get(apiURL, (apiRes) => {
        let data = '';

        apiRes.on('data', (chunk) => {
            data += chunk;
        });

        apiRes.on('end', () => {
            try {
                const weatherData = JSON.parse(data);
                const temperatureKelvin = weatherData.main.temp;
                const temperatureCelsius = temperatureKelvin - 273.15;

                const details = {
                    cityName : city,
                    temperature: temperatureCelsius.toFixed(2),
                    description: weatherData.weather[0].description,
                    iconURL: `http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`,
                    coordinates: `${weatherData.coord.lat}, ${weatherData.coord.lon}`,
                    feelsLike: (weatherData.main.feels_like - 273.15).toFixed(2),
                    humidity: weatherData.main.humidity,
                    pressure: weatherData.main.pressure,
                    windSpeed: weatherData.wind.speed,
                    countryCode: weatherData.sys.country,
                    rainVolumeLast3Hours: weatherData.rain ? weatherData.rain['3h'] || 0 : 0
                };

                res.render('weatherResult', { details, yandexMapApiKey: 'd0ca8184-f0b9-4161-a252-3b1ff1c6ffa2' });
            } catch (error) {
                console.error(error);
                res.send('Error parsing weather data.');
            }
        });
    }).on('error', (error) => {
        console.error(error);
        res.send('Error retrieving weather data.');
    });
});

app.post('/dictionary', (req, res) => {
    const word = req.body.word;
    if (!word) {
        return res.send('Please enter a word.');
    }
    const apiURL = `https://api.dictionaryapi.dev/api/v2/entries/en_US/${word}`;
    https.get(apiURL, (apiRes) => {
        let data = '';

        apiRes.on('data', (chunk) => {
            data += chunk;
        });

        apiRes.on('end', () => {
            try {
                const dictionaryData = JSON.parse(data);
                res.render('dictionaryResult', { dictionaryData });
            } catch (error) {
                console.error(error);
                res.send('Error parsing dictionary data.');
            }
        });
    }).on('error', (error) => {
        console.error(error);
        res.send('Error retrieving dictionary data.');
    });
});

app.post('/translate', (req, res) => {
    const textToTranslate = req.body.textToTranslate;
    const sourceLanguage = req.body.sourceLanguage;
    const targetLanguage = req.body.targetLanguage;

    if (!textToTranslate || !sourceLanguage || !targetLanguage) {
        return res.send('Please provide text to translate and language information.');
    }

    const apiKey = 'trnsl.1.1.20240122T174900Z.14dee86042344f98.a70f16594a88a07e57139b2d79e184ad2e835838';
    const apiURL = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${apiKey}&text=${encodeURIComponent(textToTranslate)}&lang=${sourceLanguage}-${targetLanguage}`;

    https.get(apiURL, (apiRes) => {
        let data = '';

        apiRes.on('data', (chunk) => {
            data += chunk;
        });

        apiRes.on('end', () => {
            try {
                const translationData = JSON.parse(data);
                const translatedText = translationData.text[0];

                res.render('translationResult', { translatedText });
            } catch (error) {
                console.error(error);
                res.send('Error parsing translation data.');
            }
        });
    }).on('error', (error) => {
        console.error(error);
        res.send('Error retrieving translation data.');
    });
});

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`);
});