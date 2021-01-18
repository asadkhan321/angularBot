const SERVER_PORT = process.env.SERVER_PORT || 5000;
const express = require('express')
const bodyParser = require("body-parser");
const app = express();
app.use(express.static('public'));
app.use(express.json());

app.post('/call', function(req, res) {
    console.log('body =',req.body);
res.send('response from node.js');
});
// app.use('/call/create', callController);
// app.use('/call/start', callController);
// app.use('/call/stop', callController);
// app.use('/call/session', callController);
// app.use('/call/sendEmail', callController);
// app.use('/create', callController);
app.listen(SERVER_PORT, () => {
    console.log("---------------------------------------------------------");
    console.log(" ")
    console.log(` Server is listening on port ${SERVER_PORT}`);
    console.log(" ")
    console.log("---------------------------------------------------------");
    
    
});