const ObjectId = require('mongodb').ObjectId;

module.exports = (db) => ({
    get: (eventId) => {
        return db.collection('participations').find({eventId: ObjectId(eventId)}).toArray();
    },
    update: (id) => {
        return db.collection('participations').updateOne({_id: ObjectId(id)}, {$inc: {round: 1}})
    }
});
