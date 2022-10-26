const router = require("express").Router();
const Family = require("../models/Family");
const {verifyTokenAndAdmin} = require("../middlewares/verifyToken");
const { generateRandomFamilyId } = require("../utilities/utils");
const Member = require("../models/Member");
const sequalize = require("../config/database");

router.get('/',verifyTokenAndAdmin, async (req, res) => {
    try{
        const families = await Family.findAll({include : "Members",where:{"isDeleted":false}});
        res.status(200).json(families)
    }catch(err){
        res.status(500).json(err)
    }
});

router.get('/:id',verifyTokenAndAdmin, async (req, res) => {
    try{
        const family = await Family.findOne({include:"Members",where:{"id":req.params.id,"isDeleted":false}});
        res.status(200).json(family)
    }catch(err){
        res.status(500).json(err)
    }
});

router.post('/',verifyTokenAndAdmin,async (req, res) => {
    try{
        const data = req.body;
        data["added_by"] = req.user.id;
        const family_data = {...data,family_id : generateRandomFamilyId(),isDeleted:false}
        const family = await Family.create(family_data);
        res.status(201).json(family);
    }catch(err){
        res.status(500).json(err)
    }
});

router.put('/:id',verifyTokenAndAdmin, async (req, res) => {
    const data = req.body;
    try{
        await Family.update(data,{"where" : {"id":req.params.id}});
        const family = await Family.findOne({"where":{"id":req.params.id}})
        res.status(201).json(family);
    }catch(err){
        res.status(500).json(err)
    }
});

router.delete('/:id',verifyTokenAndAdmin, async (req, res) => {
    try{
        var todayDate = new Date().toISOString().slice(0, 10);
        const data = {
            isDeleted : 1,
            deletedBy : req.user.id,
            deletedOn : todayDate
        };
            await Member.update({
                active_status : 0,
                active_from : null,
                inactivity_reason : "Family is deleted",
                isDeleted : 1,
                }, 
                { "where": { 
                    "family_id": req.params.id
                } 
            });
        await Family.update(data,{"where":{"id":req.params.id}});
        res.status(201).json(true);
    }catch(err){
        console.log(err);
        res.status(500).json(err)
    }
});


module.exports = router;