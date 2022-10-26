const router = require("express").Router();
const JmkPaymentHistory = require("../models/JmkPaymentHistory");
const sequalize = require("../config/database");
const {verifyTokenAndAdmin,verifyToken} = require("../middlewares/verifyToken");


router.get('/:id',verifyTokenAndAdmin, async (req, res) => {
    try{
        const payHistory = await JmkPaymentHistory.findOne({where:{"id":req.params.id}});
        res.status(200).json(payHistory)
    }catch(err){
        res.status(500).json(err)
    }
});

router.get('/member/:id',verifyTokenAndAdmin, async (req, res) => {
    try{
        const payHistory = await sequalize.query(`SELECT jmk.jmkpaymenthistories.id,jmk.jmkpaymenthistories.payment_status,jmk.jmkpaymenthistories.payment_mode,jmk.jmkpaymenthistories.receipt_no,
        jmk.jmkpaymenthistories.details,jmk.jmkyears.start_year,jmk.jmkyears.end_year,jmk.jmkyears.amount 
        FROM jmk.jmkpaymenthistories,jmk.jmkyears 
        WHERE jmk.jmkpaymenthistories.year = jmk.jmkyears.id AND member_id = ${req.params.id}`,{ type: sequalize.QueryTypes.SELECT });
        res.status(200).json(payHistory)
    }catch(err){
        res.status(500).json(err)
    }
});

router.get('/',verifyTokenAndAdmin, async (req, res) => {
    try{
        const payHistory = await JmkPaymentHistory.findAll({include : ['JmkYear']});
        res.status(200).json(payHistory)
    }catch(err){
        res.status(500).json(err)
    }
});

router.post('/',verifyTokenAndAdmin,async (req, res) => {
    const data = req.body;
    data["added_by"] = req.user.id;
    try{
        const payHistory = await JmkPaymentHistory.create(data);
        res.status(201).json(payHistory);
    }catch(err){
        res.status(500).json(err)
    }
});

router.put('/:id',verifyTokenAndAdmin, async (req, res) => {
    const data = req.body;
    data["added_by"] = req.user.id;
    try{
        await JmkPaymentHistory.update(data,{"where" : {"id":req.params.id}});
        const payHistory = await JmkPaymentHistory.findOne({"where":{"id":req.params.id}})
        res.status(201).json(payHistory);
    }catch(err){
        res.status(500).json(err)
    }
});

router.delete('/:id',verifyTokenAndAdmin, async (req, res) => {
    try{
        const payHistory = await JmkPaymentHistory.destroy({"where":{"id":req.params.id}})
        res.status(201).json(payHistory);
    }catch(err){
        res.status(500).json(err)
    }
});


module.exports = router;