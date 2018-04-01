const router = require('express').Router();

module.exports = (db) => {
    const participantDb = require('../../db/participant')(db);
    const eventDb = require('../../db/event')(db);
    router.get('/:id', async (req, res) => {
        const eventId = req.params.id;
        const event = await eventDb.get(eventId);
        if (!event) {
            return res.status(404).json({message: 'Event not found'});
        }
        const {rounds} = event;
        const participants = await participantDb.get(eventId);
        const result = [];
        for (let i = 0; i < rounds - 1; i++) {
            result.push({
                round: i + 1,
                participants: participants.filter(p => p.round > i + 1).map(p => p.name)
            });
        }
        res.json(result);
    });
    return router;
};