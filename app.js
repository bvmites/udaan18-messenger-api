const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const users = require('./api/users');
const events = require('./api/events');
const textlocal = require('./api/textlocal');
const auth = require('./middleware/auth');

const port = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const server = require('http').createServer(app);
const io = require('socket.io')(server).of('/receipts');
server.listen(port);

(async () => {
    try {
        const client = await MongoClient.connect(process.env.DB);
        console.log('Connected to database.');
        const db = client.db('udaan18');
        const userDb = client.db('users');

        app.use('/events', auth, events(db, io));
        app.use('/user', users(userDb));
        app.use('/textlocal', textlocal(db, io));

        app.use((req, res, next) => {
            let err = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        app.use((err, req, res, _) => {
            res.status(err.status || 500).json({message: err.message});
        });
    } catch (e) {
        console.log('Cannot connect');
        console.log(e);
        process.exit(1);
    }
})();

module.exports = app;
