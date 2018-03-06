const router = require('express').Router();

module.exports = (db)=>{
    const Event = require('../../db/event')(db);
    // get event details
    router.get('/events/:id',async(req,res) =>{
        try{
        const event = await get(req.params.id);
        if(event!=null){
            res.sendStatus(200).json(event);
        }
        else{
            res.sendStatus(404).json({message:'event not found'});
        }
        } catch(e){
            res.sendStatus(500).json({message:'event not found'});
    }
    });
    router.get('/events/:eventId/participants',async(req,res)=>{
        try{
            const participant = await get(req.params.eventId);
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
