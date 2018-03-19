const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const dotenv = require('dotenv');

const users = require('./api/users');
const events = require('./api/events');
const textlocal = require('./api/textlocal');
const auth = require('./middleware/auth');
const port = process.env.port || 4000;
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
server.listen(port);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

dotenv.config();
(async () => {
    try {
        const client = await MongoClient.connect(process.env.DB);
        console.log('Connectd to database.');
        const db = client.db('udaan18');
        const db2 = client.db('users');
        app.use('/events', auth, events(db, io));
        app.use('/users', users(db2));
        app.use('/textlocal', textlocal(db, io));
        app.get('/', function (req, res) {
            res.sendFile(__dirname + '/index.html');
        });
        app.use(function (req, res, next) {
            let err = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        app.use(function (err, req, res, next) {
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};
            res.status(err.status || 500).json({message: err.message});
        });
    } catch (e) {
        console.log('Cannot connect');
        console.log(e);
    }
})();


module.exports = app;
