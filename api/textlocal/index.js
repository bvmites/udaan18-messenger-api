const router = require('express').Router();
const socketClientList = [];
module.exports = (db, io) => {
    io.on('connection', function (socket) {
        console.log('connected...');
        socketClientList.push(socket);
    });
    const Participant = require('../../db/participant')(db);
    router.post('/', async (req, res) => {
        try {
            const {number, status, customID, datetime} = req.body;
            const getReceipt = await Participant.receipt(number, status, customID, datetime);
            const updateStatus = await Participant.updateStatus(number, customID, status);
            socketClientList.forEach(function (socket) {
                socket.emit('receipt', req.body);
            });
            res.status(200).json({message: "got receipt and updated status"});
        } catch (e) {
            console.log(e);
        }

    });
    return router;
}