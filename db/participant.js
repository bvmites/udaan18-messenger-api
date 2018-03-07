const ObjectId = require('mongodb').ObjectId;

module.exports = (db) => ({
    get: (eventId) => {
        return db.collection('participations').find({eventId: ObjectId(eventId)}).toArray();
    }
});
