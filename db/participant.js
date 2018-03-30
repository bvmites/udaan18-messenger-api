const ObjectId = require('mongodb').ObjectId;

module.exports = (db) => ({
    get: (eventId) => {
        return db.collection('participations')
            .find({eventId: ObjectId(eventId)})
            .project({name: 1, phone: 1, round: 1, deliveryStatus: 1})
            .toArray();
    },
    getContact: (eventId, ids) => {
        const participantIds = ids.map(id => ObjectId(id));
        return db.collection('participations')
            .find({eventId: ObjectId(eventId), _id: {$in: participantIds}})
            .project({phone: 1, _id: 0})
            .toArray();
    },
    getDetails: (eventId) => {
        return db.collection('events')
            .findOne({_id: ObjectId(eventId)});
    },
    promoteNext: (eventId, ids) => {
        const participantIds = ids.map(id => ObjectId(id));
        return db.collection('participations').updateMany(
            {
                eventId: ObjectId(eventId),
                _id: {$in: participantIds}
            },
            {$inc: {round: 1}}
        );
    },
    receipt: (number, status, customID, datetime) => {
        return db.collection('receipts')
            .insertOne({number, status, customID, datetime});
    },
    updateStatus: (number, customID, status) => {
        console.log({number, customID, status});
        return db.collection('participations').updateOne(
            {
                eventId: ObjectId(customID),
                phone: number
            },
            {$set: {deliveryStatus: status}}
        );
    }
});
