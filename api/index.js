const express = require('express');
var router = express.Router();

const eventSchema = require('../schema/event');
const participantsSchema = require('../schema/participant');
const promotionData = require('../schema/promotionData');


// /* GET home page. */
// router.get('/', function(req, res) {
//   res.render('index', { title: 'Express' });
// });
//
// module.exports = router;
