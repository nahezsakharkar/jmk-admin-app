const router = require("express").Router();
const Admin = require("../models/Admin");
const House = require("../models/House");
const Family = require("../models/Family");
const Member = require("../models/Member");
const sequalize = require("../config/database");
const JmkPaymentHistory = require("../models/JmkPaymentHistory")
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");

router.get('/', verifyTokenAndAdmin, async (req, res) => {
    try {
        const admins = await Admin.count()
        const houses = await House.count()
        const families = await Family.count()
        const members = await Member.count()
        const payments = await sequalize.query(
            "SELECT jp.id,jp.payment_status,jy.amount FROM jmk.JmkPaymentHistories jp JOIN jmk.JmkYears jy ON jp.year= jy.id", { type: sequalize.QueryTypes.SELECT })
        const lastSixMonthsRev = await sequalize.query("SELECT date_format(jph.paid_on, '%M') as MonthName,month(jph.paid_on) as Month,sum(amount) as Revenue FROM jmk.JmkPaymentHistories jph JOIN jmk.JmkYears ON jph.JmkYearId = jmk.JmkYears.id WHERE Datediff(jph.paid_on,now()) > -182 and payment_status != 'due' GROUP BY date_format(jph.paid_on, '%M') Order by Month Desc", { type: sequalize.QueryTypes.SELECT });
        let expected = 0;
        let received = 0;
        payments.filter(obj => {
            if (obj.payment_status == "paid") {
                received += obj.amount
            }
            expected += obj.amount
        })

        const Months = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        let mList = []
        lastSixMonthsRev.forEach(rev=>{
            mList.push(rev.MonthName)
        })
        let revData = []
        Months.forEach((item,index)=>{
            let obj = {
                month : index+1,
                MonthName : item,
                revenue : 0
            }
            if(mList.includes(item)){
                for(let j=0;j<lastSixMonthsRev.length;j++){
                    if(lastSixMonthsRev[j].MonthName == item){
                        obj.revenue = lastSixMonthsRev[j].Revenue
                    }
                }
                revData.push(obj)
            }else{
                revData.push(obj)
            }
        });

        const data = {
            admins: admins,
            houses: houses,
            families: families,
            members: members,
            expected: expected,
            received: received,
            lastSixMonthsRev: revData
        }

        res.status(201).json(data);
    } catch (err) {
        res.status(500).json(err)
    }
});

module.exports = router;