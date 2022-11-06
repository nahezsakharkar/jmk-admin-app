const router = require("express").Router();
const Member = require("../models/Member");
const Family = require("../models/Family");
const sequalize = require("../config/database");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const { generateRandomFamilyId } = require("../utilities/utils");
const { generatePayments } = require("../utilities/utils");
const {sendCredentialsEmail} = require("../utilities/utils");
const {generateRandomPassword} = require("../utilities/utils");



router.get('/', verifyTokenAndAdmin, async (req, res) => {
    try {
        const members = await Member.findAll({include: ["JmkPaymentHistories"]});
        res.status(200).json(members)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
});

router.get('/details', verifyTokenAndAdmin, async (req, res) => {
    try {
        const members = await sequalize.query("SELECT jmk.Members.id,jmk.Members.name,jmk.Members.email,jmk.Members.contact,jmk.Members.password,active_status,active_from,head_of_family,inactivity_reason,jmk.Members.createdAt,jmk.Members.updatedAt,jmk.Families.family_id,jmk.Admins.name as added_by FROM jmk.Members JOIN jmk.Families ON jmk.Members.family_id = jmk.Families.id JOIN jmk.Admins ON jmk.Members.added_by=jmk.Admins.id WHERE jmk.Members.isDeleted = false;",{ type: sequalize.QueryTypes.SELECT });
        res.status(200).json(members)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
});

router.get('/details/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const members = await sequalize.query("SELECT jmk.Members.id,jmk.Members.name,jmk.Members.email,jmk.Members.contact,jmk.Members.password,active_status,active_from,head_of_family,inactivity_reason,jmk.Members.createdAt,jmk.Members.updatedAt,jmk.Families.family_id,jmk.Admins.name as added_by,jmk.Houses.id as house_id,jmk.Houses.house_no,jmk.Houses.house_name FROM jmk.Members JOIN jmk.Families ON jmk.Members.family_id = jmk.Families.id JOIN jmk.Admins ON jmk.Members.added_by=jmk.Admins.id JOIN Houses On Houses.id = (SELECT jmk.Families.house_no FROM jmk.Families JOIN jmk.Members WHERE jmk.Members.family_id=jmk.Families.id and jmk.Members.id ="+req.params.id+") WHERE jmk.Members.isDeleted = false and jmk.Members.id ="+req.params.id+";",{ type: sequalize.QueryTypes.SELECT });
        res.status(200).json(members[0])
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
});

router.get('/paymentDetails/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const payments = await sequalize.query("SELECT jph.id,jph.payment_status,jph.payment_mode,jph.receipt_no,jph.paid_on,jph.details,jph.createdAt,jph.updatedAt,jy.start_year,jy.end_year,jy.amount,jmk.Admins.name as added_by FROM jmk.JmkPaymentHistories jph JOIN jmk.JmkYears jy ON jph.year = jy.id JOIN jmk.Admins ON jph.added_by=jmk.Admins.id WHERE jph.member_id="+req.params.id,{ type: sequalize.QueryTypes.SELECT });
        res.status(200).json(payments)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
});

router.get('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const member = await Member.findOne({ include: "JmkPaymentHistories", where: { "id": req.params.id,"isDeleted":false} });
        res.status(200).json(member)
    } catch (err) {
        res.status(500).json(err)
    }
});

router.post('/', verifyTokenAndAdmin, async (req, res) => {
    try {
        let member;
        const data = req.body;
        data["added_by"] = req.user.id;
        data["isDeleted"] = 0;
        if (data.head_of_family == true) {
            const familyData = { 
                added_by: req.user.id, 
                ...data.family,
                isDeleted : 0,
                family_id:generateRandomFamilyId() }
            const family = await Family.create(familyData);
            console.log(family);
            data.family_id = family.id
            member = await Member.create(data);
        } else {
            console.log(data);
            member = await Member.create(data);
        }
        if(data.active_status == true){
            console.log("Active From : ",data.active_from)
            let formated_date = data.active_from.split("-").reverse().join("-");  
            await generatePayments(formated_date,member.id,req.user.id);
        }
        let mailSent = await sendCredentialsEmail(data.email,{loginEmail:data.email,loginPassword:data.password});
        console.log(mailSent);
        res.status(201).json(member);
    } catch (err) {
        console.log("Date error");
        console.log(err);
        res.status(500).json(err)
    }
});

router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
    const data = req.body;
    try {
        await Member.update(data, { "where": { "id": req.params.id } });
        const member = await Member.findOne({ "where": { "id": req.params.id } })
        res.status(201).json(member);
    } catch (err) {
        res.status(500).json(err)
    }
});

router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const data = {
            isDeleted : true,
        };
        const member = await Member.update(data,{ "where": { "id": req.params.id } })
        res.status(201).json(member);
    } catch (err) {
        res.status(500).json(err)
    }
});

router.post("/activate/:id", verifyTokenAndAdmin, async (req,res)=>{
    try {
        console.log("activate hit")
        const data = req.body;
        const memberId = req.params.id;
        await Member.update({
            active_status : 1,
            active_from : data.active_from,
            inactivity_reason : null,
            }, 
            { "where": { 
                "id": memberId 
            } 
        });
        console.log(data.active_from);
        await generatePayments(data.active_from,memberId,req.user.id);
        console.log(res.status);
        return res.status(201).json({data:"done"});
    } catch (err) {
        console.log("Error in Activate",err)
        res.status(500).json(err)
    }
})

router.post('/sendcredentials/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const member = await Member.findOne({ where: { "id": req.params.id,"isDeleted":false} });
        let mailSent = await sendCredentialsEmail(member.email,{loginEmail:member.email,loginPassword:member.password});
        console.log(mailSent);
        res.status(200).json(mailSent);
    } catch (err) {
        res.status(500).json(err)
    }
});

router.post('/resetpassword', verifyTokenAndAdmin, async (req, res) => {
    try {
        const email = req.body.email;
        const newPassword = generateRandomPassword(8);
        const updatePssword = await Member.update({password:newPassword},{ "where": { "email": email,"isDeleted":false} });
        if(updatePssword[0] < 1){
            res.status(500).json({msg:"failed to update password please verify email address of member"})
        }else{
            const member = await Member.findOne({ where: { "email": email,"isDeleted":false} });
            let mailSent = await sendCredentialsEmail(member.email,{loginEmail:member.email,loginPassword:member.password});
            console.log(mailSent);
            res.status(200).json(member);   
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
});

module.exports = router;