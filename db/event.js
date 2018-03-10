const ObjectId = require('mongodb').ObjectId;

module.exports = (db) => ({
    get: (id) => {
        // const ans =
        return db.collection('events').findOne({_id: ObjectId(id)});
    },
    update: (id) => {
        return db.collection('events').updateOne({_id: ObjectId(id)}, {$inc: {currentRound: 1}})
    }
});
