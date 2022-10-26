const router = require("express").Router();
const { verifyToken } = require("../middlewares/verifyToken");
const sequalize = require("../config/database");

/* MEMBER DETAILS
    TotalFamilyDues
    }
*/
router.get("/memberDetails/", verifyToken, async (req, res) => {
    try {
        const user = req.user.id
        const member = await sequalize.query(
            "SELECT jm.name,jm.email,jm.active_status,jm.active_from,jf.family_id as family_code,jf.id as family_id,jf.family_head  FROM jmk.members jm JOIN jmk.families jf ON jm.family_id = jf.id WHERE jm.id =" + user, { type: sequalize.QueryTypes.SELECT });

        const memberCount = await sequalize.query(
            "SELECT count(*) as familyCount FROM jmk.members Where family_id =" + member[0].family_id, { type: sequalize.QueryTypes.SELECT });

        const memberPayments = await sequalize.query(
            "SELECT jmkyears.start_year,jmkyears.amount,jp.paid_on,jp.receipt_no,jp.payment_status FROM jmkpaymenthistories jp JOIN jmkyears ON jp.year= jmkyears.id WHERE jp.member_id="+ user, { type: sequalize.QueryTypes.SELECT });
        
        let memberTotal = 0;
        let memberPaid = 0;
        memberPayments.filter(obj => {
            if (obj.payment_status == "paid") {
                memberPaid += obj.amount
            }
            memberTotal += obj.amount
        });

        let memberDue = memberTotal - memberPaid;

        let response = { ...member[0], ...memberCount["0"],member_paidAmount : memberPaid,member_dueAmount : memberDue}

        return res.status(200).json(response);
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
});

router.get("/memberPayments/", verifyToken, async (req, res) => {
    try{
        const user = req.user.id;
        const memberPayments = await sequalize.query(
            "SELECT jmkyears.start_year,jmkyears.amount,jp.paid_on,jp.receipt_no,jp.payment_status FROM jmkpaymenthistories jp JOIN jmkyears ON jp.year= jmkyears.id WHERE jp.member_id="+user , { type: sequalize.QueryTypes.SELECT });
        return res.status(200).json(memberPayments);
    }catch(err){
        console.log(err)
        return res.status(500).json(err)
    }
});



module.exports = router;