const ObjectId = require('mongodb').ObjectId;

module.exports = (db) => ({
    get: (eventId) => {
        return db.collection('participations').find({eventId: ObjectId(eventId)}).toArray();
    },
    promoteNext: (eventId, ids) => {
        const participantIds = ids.map(id => ObjectId(id));
        console.log(participantIds);
        console.log(eventId);
        return db.collection('participations').updateMany({
            eventId: ObjectId(eventId),
            _id: {$in: participantIds}
        }, {$inc: {round: 1}})
    },
    receipt: (number, status, customID, datetime) => {
        return db.collection('receipts').insertOne({number, status, customID, datetime});
    },
    updateStatus: (number,customID,status) => {
        return db.collection('participations').updateOne({eventId: ObjectId(customID),phone:number},{$set: {deliveryStatus: status}});
    }
});
