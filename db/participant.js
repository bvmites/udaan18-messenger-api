const ObjId = require('mongodb');

module.exports = (db) =>({
    get: (eventId) => {
    return db.collection('participants').find({_id: ObjectId(eventId)});
}
});
