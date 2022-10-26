const router = require("express").Router();
const Admin = require("../models/Admin");
const {verifyTokenAndAdmin} = require("../middlewares/verifyToken");



router.get('/', verifyTokenAndAdmin,async (req, res) => {
    try{
        const admins = await Admin.findAll({attributes : {exclude : ['password']},include:'Houses',where:{"isDeleted":false}});
        res.status(200).json(admins);
    }catch(err){
        console.log(err);
        res.status(500).json(err)
    }
});

router.get('/:id', verifyTokenAndAdmin,async (req, res) => {
    try{
        const admin = await Admin.findOne({attributes : {exclude : ['password']},include : "Houses",where:{"id":req.params.id,"isDeleted":false}});
        res.status(200).json(admin);
    }catch(err){
        res.status(500).json(err)
    }
});


router.post('/', async (req, res) => {
    const data = req.body;
    try{
        data["isDeleted"] = false;
        console.log(data);
        const user = await Admin.create(data);
        res.status(201).json(user);
    }catch(err){
        res.status(500).json(err)
    }
});

router.put('/:id',verifyTokenAndAdmin, async (req, res) => {
    const data = req.body;
    try{
        await Admin.update(data,{"where" : {"id":req.params.id}});
        const admin = await Admin.findOne({attributes : {exclude : ['password']},"where":{"id":req.params.id}})
        res.status(201).json(admin);
    }catch(err){
        res.status(500).json(err)
    }
});

router.delete('/:id', verifyTokenAndAdmin,async (req, res) => {
    try{
        const data = {
            isDeleted : true,
        };
        const admin = await Admin.update(data,{"where":{"id":req.params.id}})
        res.status(201).json(admin);
    }catch(err){
        res.status(500).json(err)
    }
});




module.exports = router;