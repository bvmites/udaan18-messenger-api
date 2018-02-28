const router = require('express').Router();
const eventSchema = require('../../schema/event.json');
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
    })
}