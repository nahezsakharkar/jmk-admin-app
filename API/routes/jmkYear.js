const router = require("express").Router();
const JmkYear = require("../models/JmkYear");
const Member = require("../models/Member");
const {verifyTokenAndAdmin} = require("../middlewares/verifyToken");
const { generatePayments } = require("../utilities/utils");



router.get('/',verifyTokenAndAdmin, async (req, res) => {
    try{
        const years = await JmkYear.findAll();
        res.status(200).json(years)
    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
});

router.get('/:id',verifyTokenAndAdmin, async (req, res) => {
    try{
        const year = await JmkYear.findOne({where:{"id":req.params.id}});
        res.status(200).json(year)
    }catch(err){
        res.status(500).json(err)
    }
});

router.post('/',verifyTokenAndAdmin,async (req, res) => {
    const data = req.body;
    data["added_by"] = req.user.id;
    try{
        const year = await JmkYear.create(data);
        const activeMembers = await Member.findAll({ "where": { "active_status": true } })
        for(let i=0;i<activeMembers.length;i++){
            let activeFrom = parseInt(activeMembers[i].active_from.split("-")[0])
            if(data.start_year >= activeFrom) {
                await generatePayments(year.start_year,activeMembers[i].id,req.user.id);
            }
        }
        res.status(201).json(year);
    }catch(err){
        res.status(500).json(err)
    }
});

router.put('/:id',verifyTokenAndAdmin, async (req, res) => {
    const data = req.body;
    data["added_by"] = req.user.id;
    try{
        await JmkYear.update(data,{"where" : {"id":req.params.id}});
        const year = await JmkYear.findOne({"where":{"id":req.params.id}})
        res.status(201).json(year);
    }catch(err){
        res.status(500).json(err)
    }
});

router.delete('/:id',verifyTokenAndAdmin, async (req, res) => {
    try{
        const year = await JmkYear.destroy({"where":{"id":req.params.id}})
        res.status(201).json(year);
    }catch(err){
        res.status(500).json(err)
    }
});


module.exports = router;