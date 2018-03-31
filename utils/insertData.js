const fs = require('fs');
const crypto = require('crypto');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const parse = require('csv-parse/lib/sync');
require('dotenv').config();
const hashPassword = require('./hashPassword');

const fileName = 'data/finalmanagers.csv';
const data = fs.readFileSync(fileName);

function readEventData(fileName) {
    const data = fs.readFileSync(fileName);
    return parse(data).map(row => ({
        name: row[1],
        phone: row[2],
        round: 0,
        deliveryStatus: 'U'
    })).slice(1); // remove header
}

async function addEventToDatabase({eventName, rounds, phone, participants}, db, userDb) {
    // Insert event
    const insertedEvent = await db.collection('events').insertOne({
        eventName,
        rounds,
        currentRound: 0
    });
    const insertedId = insertedEvent.insertedId;

    // Insert participants
    const insertedParticipants = await db.collection('participations')
        .insertMany(participants.map(p => ({...p, eventId: ObjectId(insertedId)})));

    // Generate password
    const salt = crypto.randomBytes(512).toString('hex');
    const iterations = Math.floor(Math.random(500) + 500);
    const password = crypto.createHmac('sha512', process.env.PASS_KEY)
        .update(phone).digest('hex').toString().slice(0, 6);
    const hashedPassword = hashPassword(password, salt, iterations);

    // Insert user
    const insertedUser = await userDb.collection('eventManagers').insertOne({
        _id: phone,
        password: {
            salt, iterations, hash: hashedPassword
        },
        eventId: ObjectId(insertedId)
    });
    console.log(insertedId, eventName, phone, password);
}

const parsedData = parse(data).slice(1).map((row, i) => {
    let participants;
    try {
        participants = readEventData(`data/participants/${row[4]}`);
    } catch (e) {
        console.log(e);
        console.log(`Check line ${i + 1}`);
        process.exit(1);
    }
    return {
        eventName: row[0],
        managerName: row[1],
        phone: row[2],
        email: row[3],
        rounds: +(row[5]),
        participants
    }
});

MongoClient.connect(process.env.DB).then(client => {
    const db = client.db('udaan18');
    const userDb = client.db('users');
    parsedData.forEach(async (event) => {
        await addEventToDatabase(event, db, userDb);
    });
});
