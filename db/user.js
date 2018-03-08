const crypto = require('crypto');
const hashPassword = require('../utils/hashPassword');

module.exports = (db2) => ({
    get: (username) => {
        return db2.collection('eventManagers').findOne({_id: username});
    },
    create: ({username, password}) => {
        const salt = crypto.randomBytes(512).toString('hex');
        const iterations = Math.floor((Math.random() * 500) + 500);
        const hashedPassword = hashPassword(password, salt, iterations);
        return db2.collection('eventManagers').insertOne({
            _id: username,
            password: {
                hash: hashedPassword,
                salt,
                iterations
            }
        });
    }
});