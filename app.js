const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const dotenv = require('dotenv');

const index = require('./api/events/index');
const users = require('./api/users');
const events = require('./api/events');

const app = express();

app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

dotenv.config();

(async () => {
    try {
        const client = await MongoClient.connect(process.env.db);
        const db = client.db('udaan18');
        app.use('/', events(db));

        app.use(function (req, res, next) {
            let err = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        app.use(function (err, req, res, next) {
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};
            res.status(err.status || 500);
        });
    } catch (e) {
        console.log('Cannot connect');
        console.log(e);
    }
})();


module.exports = app;
