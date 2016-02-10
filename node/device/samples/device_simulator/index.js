var Client  = require('azure-iot-device').Client;
var Transport = require('azure-iot-device-http').Http;
var Message = require('azure-iot-common').Message;
var express = require('express');
var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser');
var session = require('express-session')

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: '1234567890QWERTY',
    resave: false,
    saveUninitialized: false
}));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function (req, res, next) {
    res.render('home');
});

app.post('/send', function(req, res, next) {
    var client = Client.fromConnectionString(req.session.connectionString, Transport);
    client.open(function (openErr, openResult) {
        if (openErr) {
            res.status(500).send("Could not open connection to Azure IoT Hub instance: " + openErr.message);
        } else {
            var msg = new Message(req.body.messageToSend);
            client.sendEvent(msg, function (sendErr) {
                if (sendErr) {
                    res.status(500).send("Could not open connection to Azure IoT Hub instance: " + sendErr.message);
                } else {
                    console.log('message sent');
                    res.render('home', { connected: true, showMessage: true, message: 'message sent successfully' });
                }
            });
        }
    });     
});

app.post('/connect', function (req, res, next) {
    req.session.connectionString = req.body.connectionString;
    var client = Client.fromConnectionString(req.session.connectionString, Transport);
    client.open(function (openErr, openResult) {
        if (openErr) {
            res.status(500).send("Could not open connection to Azure IoT Hub instance: " + openErr.message);
        } else {
            req.session.messages = [];
            client.on('message', function (msg) {
                console.log('got a message: ' + msg.data);
                req.session.messages.push(msg.data);
                req.session.save();
                client.complete(msg, function (completeErr, completeRes) {
                    if(completeErr) {
                        res.status(500).send('Could not complete message');
                    }
                });
            });
            client.on('error', function (err) {
                console.error('Client error: ' + err.message);
            });
            res.render('home', { connected: true });
        }
    }); 
});

app.get('/receive', function (req, res, next) {
    res.send({ messages: req.session.messages });
});

app.listen(3000);