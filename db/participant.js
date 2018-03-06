const ObjectId = require('mongodb').ObjectId;

module.exports = (db) =>({
    get: (eventId) => {
    return db.collection('participations').find({_id: ObjectId(eventId)});
    }
});
