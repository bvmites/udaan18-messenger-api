const router = require('express').Router();
const eventSchema = require('../../schema/event.json');
const participant = require('../../schema/participant.json');
const Validator = require('jsonschema').Validator;
const validator = new Validator();
module.exports = (db)=>{
    const Event = require('../../db/event')(db);
    // get event details
    router.get('/:id',async(req,res) =>{
        try{
        const event = await Event.get(req.params.id);
        if(event!=null){
            res.status(200).json(event);
        }
        else{
            res.status(404).json({message:'event not found'});
        }
        } catch(e){
            res.status(500).json({message:'event not found'});
    }
    });
    router.get('/:eventId',async(req,res)=>{
        try{
            const participant = await Participant.get(req.params.eventId);
            if(participant!=null){
                res.status(200).json(participant);
            }
            else{
                res.status(404).json({message:'no participants for this event'})
            }}
            catch(e){
                res.status(401).json({message:'Unauthorized, please check your login'})
        }
    });
}
