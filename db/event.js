const ObjectId = require('mongodb').ObjectId;

module.exports = (db) => ({
    get: (id) => {
        return db.collection('events')
            .findOne({_id: ObjectId(id)}, {projection: {currentRound: 1, _id: 0, eventName: 1, rounds: 1}});
    },
    incrementRound: (id) => {
        return db.collection('events').updateOne(
            {_id: ObjectId(id)},
            {$inc: {currentRound: 1}},
            {upsert: false}
        );
    }
});
