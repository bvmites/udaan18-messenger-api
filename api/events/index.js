const router = require('express').Router();

//const httpRequest = require('request-promise-native');
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
            console.log(event.currentRound);
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
            const partround = await Participant.promoteNext(eventId, ids);
            res.status(200).json({message: 'updated round'});

        } catch (e) {
            res.status(500).json({message: 'internal server error'});
        }
    });
    router.put('/textlocal', async (req, res) => {
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
    /*router.post('/:eventId/participations', async (req,res) => {
        try{
            const {apiKey,username,hash,password,numbers,test,sender} = req.body;
            const eventId = req.params.eventId;
            const message = "testing...";
            const reqBody = await httpRequest.post({
                url:'http://api.textlocal.in/send',
                form:{
                    apiKey,
                    username,
                    hash,
                    password,
                    numbers,
                    test,
                    sender,
                    custom:eventId,
                    message
                }});
            console.log(reqBody);
            }catch(e)
            {
                console.log(e);
            }
    });*/
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
