const router = require('express').Router();

const httpRequest = require('request-promise-native');
module.exports = (db, io) => {

    const eventDb = require('../../db/event')(db);
    const participantDb = require('../../db/participant')(db);

    // get event details
    router.get('/:id', async (req, res) => {
        try {
            const event = await eventDb.get(req.params.id);
            if (event != null) {
                res.status(200).json({
                    ...event,
                    isLastRound: event.currentRound >= event.rounds.length
                });
            }
            else {
                res.status(404).json({message: 'Event not found'});
            }
        } catch (e) {
            console.log(e);
            res.status(500).json({message: e.message});
        }
    });

    // TODO disable?
    router.put('/:id', async (req, res) => {
        try {
            const result = await eventDb.incrementRound(req.params.id);
            if (result.result.n > 0) {
                res.status(200).json({message: 'Round updated successfully'});
            }
            else {
                res.status(400).json({message: 'Event not found'});
            }
        } catch (e) {
            console.log(e);
            res.status(500).json({message: e.message});
        }
    });

    router.post('/:eventId/participations', async (req, res) => {

        console.log(req.user);
        if (req.params.eventId !== req.user.eventId) {
            return res.status(403).json({message: 'Unauthorized'});
        }

        try {
            // TODO validate promotion
            // TODO check last round
            const eventId = req.params.eventId;
            const {ids, date, time, venue} = req.body;

            const mobileNums = await participantDb.getContact(eventId, ids);
            const eventDetails = await eventDb.get(eventId);

            const eventName = eventDetails.eventName;
            const round = eventDetails.currentRound;

            const numbers = mobileNums.map(num => num.phone).join(",");
            const sender = process.env.SMS_SENDER;
            const apiKey = process.env.SMS_API_KEY;
            const test = process.env.SMS_TEST === 'true';

            // TODO Default message
            const message = `Dear Participant, Round ${round + 1} of ${eventName} is on ${date} ${time} at ${venue}. Kindly be present at the venue on time.`;
            const apiResponse = await httpRequest.post({
                url: 'http://api.textlocal.in/send',
                form: {
                    apiKey,
                    numbers,
                    test: true,
                    sender,
                    custom: eventId,
                    message
                }
            });
            if (JSON.parse(apiResponse).status === 'success') {
                await participantDb.promoteNext(eventId, ids);
                await eventDb.incrementRound(eventId);
                res.status(200).json({message: 'Updated round'});
            } else {
                console.log(apiResponse);
                res.status(500).json({message: 'TextLocal API Error'});
            }
        } catch (e) {
            console.log(e);
            res.status(500).json({message: e.message});
        }

    });
    router.get('/:eventId/participations', async (req, res) => {
        try {
            const allParticipants = await participantDb.get(req.params.eventId);
            const event = await eventDb.get(req.params.eventId);
            const currentParticipants = allParticipants.filter(p => p.round === event.currentRound);
            //TODO FIXME
            //TODO Add filter for current round
            if (currentParticipants.length > 0) {
                res.status(200).json(currentParticipants);
            }
            else {
                res.status(404).json({message: 'No participations found for the event.'});
            }
        }
        catch (e) {
            console.log(e);
            res.status(500).json({message: e.message});
        }
    });
    return router;
};
