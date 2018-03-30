const router = require('express').Router();
module.exports = (db, io) => {
    const Participant = require('../../db/participant')(db);
    router.post('/', async (req, res) => {
        console.log('RECEIPT', req.body);
        try {
            const {number, status, customID, datetime} = req.body;
            const getReceipt = await Participant.receipt(number, status, customID, datetime);
            const updateStatus = await Participant.updateStatus(number, customID, status);
            io.emit('receipt', req.body);
            res.status(200).json({success: true});
        } catch (e) {
            console.log(e);
            res.json({message: e.message});
        }

    });
    return router;
};
