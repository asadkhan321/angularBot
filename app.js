const SERVER_PORT = process.env.SERVER_PORT || 5000;
const express = require('express')
const bodyParser = require("body-parser");
const app = express();
app.use(express.static('public'));
app.use(express.json());
const host = 'api.worldweatheronline.com';
const wwoApiKey = '9e4d189bba84454395a71525212201';


app.post('/call', function (req, res) {
    console.log('body =', req.body);
    res.send('response from node.js');
});
app.post("/echo", function (req, res) {
    var speech =
        req.body.queryResult &&
            req.body.queryResult.parameters &&
            req.body.queryResult.parameters.echoText
            ? req.body.queryResult.parameters.echoText
            : "Seems like some problem. Speak again.";

    var speechResponse = {
        google: {
            expectUserResponse: true,
            richResponse: {
                items: [
                    {
                        simpleResponse: {
                            textToSpeech: speech
                        }
                    }
                ]
            }
        }
    };
    return res.json({
        payload: speechResponse,
        //data: speechResponse,
        fulfillmentText: speech,
        speech: speech,
        displayText: speech,
        source: "webhook-echo-sample"
      });
    });

    app.post("/weather", function (req, res) {
        let city = req.body.queryResult.parameters['geo-city']; // city is a required param

        // Get the date for the weather forecast (if present)
        let date = '';
        if (req.body.queryResult.parameters['date']) {
          date = req.body.queryResult.parameters['date'];
          console.log('Date: ' + date);
        }
      
        // Call the weather API
        callWeatherApi(city, date).then((output) => {
          res.json({ 'fulfillmentText': output }); // Return the results of the weather API to Dialogflow
        }).catch(() => {
          res.json({ 'fulfillmentText': `I don't know the weather but I hope it's good!` });
        });
    });
    function callWeatherApi (city, date) {
        return new Promise((resolve, reject) => {
          // Create the path for the HTTP request to get the weather
          let path = '/premium/v1/weather.ashx?format=json&num_of_days=1' +
            '&q=' + encodeURIComponent(city) + '&key=' + wwoApiKey + '&date=' + date;
          console.log('API Request: ' + host + path);
      
          // Make the HTTP request to get the weather
          http.get({host: host, path: path}, (res) => {
            let body = ''; // var to store the response chunks
            res.on('data', (d) => { body += d; }); // store each response chunk
            res.on('end', () => {
              // After all the data has been received parse the JSON for desired data
              let response = JSON.parse(body);
              let forecast = response['data']['weather'][0];
              let location = response['data']['request'][0];
              let conditions = response['data']['current_condition'][0];
              let currentConditions = conditions['weatherDesc'][0]['value'];
      
              // Create response
              let output = `Current conditions in the ${location['type']} 
              ${location['query']} are ${currentConditions} with a projected high of
              ${forecast['maxtempC']}°C or ${forecast['maxtempF']}°F and a low of 
              ${forecast['mintempC']}°C or ${forecast['mintempF']}°F on 
              ${forecast['date']}.`;
      
              // Resolve the promise with the output text
              console.log(output);
              resolve(output);
            });
            res.on('error', (error) => {
              console.log(`Error calling the weather API: ${error}`)
              reject();
            });
          });
        });
      }
      

    // app.use('/call/create', callController);
    // app.use('/call/start', callController);
    // app.use('/call/stop', callController);
    // app.use('/call/session', callController);
    // app.use('/call/sendEmail', callController);
    // app.use('/create', callController);
    app.listen(process.env.PORT || 5000, () => {
        console.log("---------------------------------------------------------");
        console.log(" ")
        console.log(` Server is listening on port ${SERVER_PORT}`);
        console.log(" ")
        console.log("---------------------------------------------------------");


    });