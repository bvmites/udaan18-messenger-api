const router = require('express').Router();

module.exports = (db) => {
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
            // res.status(401).json({message: 'Unauthorized, please check your login'})
            console.log(e);
            res.sendStatus(500);
        }
    });
    return router;
};
