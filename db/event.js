const ObjId = require('mongodb');

module.exports = (db) =>({
    get: (id) => {
    return db.collection('events').find({_id: ObjectId(id)});
}
});
