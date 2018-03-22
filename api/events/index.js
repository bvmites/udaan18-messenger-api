const router = require('express').Router();

const httpRequest = require('request-promise-native');
const socketClientList = [];
module.exports = (db, io) => {
    io.on('connection', function (socket) {
        socketClientList.push(socket);
    });
    const Event = require('../../db/event')(db);
    const Participant = require('../../db/participant')(db);
    // get event details
    router.get('/:id', async (req, res) => {
        try {
            const event = await Event.get(req.params.id);
            console.log(event);
            if (event != null) {
                res.status(200).json(event);
            }
            else {
                res.status(404).json({message: 'event not found'});
            }
        } catch (e) {
            console.log(e);
            res.status(500).json({message: 'event not found'});
        }
    });
    router.put('/:id', async (req, res) => {
        try {
            console.log(req.params.id);
            const round = await Event.update(req.params.id);
            if (round != null) {
                res.status(200).json({message: 'round updated successfully'});
            }
        } catch (e) {
            console.log(e);
        }
    });
    router.put('/:eventId/participations', async (req, res) => {
        try {
            const eventId = req.params.eventId;
            const ids = req.body.ids;
            const date = req.body.date;
            const time = req.body.time;
            const place = req.body.place;
            const mobileNums = await Participant.getContact(eventId, ids);
            const eventDetails = await Participant.getDetails(eventId);
            const partround = await Participant.promoteNext(eventId, ids);
            const eventName = eventDetails.eventName;
            const round = eventDetails.currentRound;
            const contacts = [];
            Object.keys(mobileNums).forEach(function (key) {
                const val = mobileNums[key]["phone"];
                contacts.push(val);
            });
            const numbers = contacts.join(",");
            const sender = process.env.SMS_SENDER;
            const apiKey = process.env.SMS_API_KEY;
            const test = process.env.SMS_TEST;
            const message = "Dear Participant, Round " + (round + 1) + " of " + eventName + " is on " + date + " " + time + " at " + place + ". Kindly be present at the venue on time.";
            const reqBody = await httpRequest.post({
                url: 'http://api.textlocal.in/send',
                form: {
                    apiKey,
                    numbers,
                    test,
                    sender,
                    custom: eventId,
                    message
                }
            });
            res.status(200).json({message: 'updated round'});
            console.log(reqBody);
        } catch (e) {
            console.log(e);
        }

    });
    router.get('/:eventId/participations', async (req, res) => {
        try {
            const participant = await Participant.get(req.params.eventId);
            if (participant != null) {
                res.status(200).json(participant);
            }
            else {
                res.status(404).json({message: 'no participants for this event'})
            }
        }
        catch (e) {
            console.log(e);
            res.sendStatus(500);
        }
    });
    return router;
};
