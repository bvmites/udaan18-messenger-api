const ObjectId = require('mongodb').ObjectId;

module.exports = (db) => ({
    get: (eventId) => {
        return db.collection('participations').find({eventId: ObjectId(eventId)}).toArray();
    },
    promoteNext: (eventId,ids) => {
        const participantIds = ids.map(id => ObjectId(id));
        console.log(participantIds);
        console.log(eventId);
        return db.collection('participations').updateMany({eventId: ObjectId(eventId),_id: {$in: participantIds}},{$inc: {round: 1}})
    }
});
