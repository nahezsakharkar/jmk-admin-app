
const sequalize = require("../config/database");
const JmkPaymentHistory = require("../models/JmkPaymentHistory");
const nodemailer = require('nodemailer');
const config = require("../config/config");

const generateRandomFamilyId = () => {
    let random1 = Math.floor(Math.random() * 100);
    let random2 = Math.floor(Math.random() * 90 + 10);
    let family_id = "F" + random2 + (Date.now() - random1).toString().substring(5);
    return family_id;
}

const createPaymentHistory = async (data) => {
    const year = await JmkPaymentHistory.create(data);
}

const generatePayments = async (date,memberId,addedBy) => {
    //Date Format 2012-08-25
    let activeFrom = parseInt(date.split("-")[0])
    console.log(activeFrom);
    const years = await sequalize.query(`SELECT * FROM jmk.JmkYears WHERE start_year >= ${activeFrom};`,{ type: sequalize.QueryTypes.SELECT });
    for(let i=0;i<years.length;i++){
        try{
            const data = {
                payment_status : "due",
                member_id : memberId,
                year : years[i]["id"],
                JmkYearId : years[i]["id"],
                added_by : addedBy
            }
            await createPaymentHistory(data);
        }catch(ex){
            console.log("Error in generatePayments",ex);
            return ex;
        }
    }
    console.log(`payments generated for member with id ${memberId} from date ${date}`)
}

const sendCredentialsEmail = (emailTo,credentials) => {

    return new Promise((resolve,reject)=>{
        const transporter = nodemailer.createTransport({
            service : 'gmail',
            auth: {
                user : config.MAILSERVICE.email,
                pass : config.MAILSERVICE.password
            }
        })

        const mail_configs = {
            from : config.MAILSERVICE.email,
            to : emailTo,
            subject : 'JMK Member Credentials',
            html : `You have been successfully registered by admin<br/>your login credentials will be : <br/> <b>email : ${credentials.loginEmail}</b><br/><b>Password :${credentials.loginPassword}</b>`
        } 

        transporter.sendMail(mail_configs,(error,info)=>{
            if(error){
                console.log(error);
                return reject({message : 'error while sending mail'})
            }
            return resolve({message : 'email sent successfully'})
        })
    });
}

const generateRandomPassword = (count)=> {
    const letter = "0123456789ABCDEFGHIJabcdefghijklmnopqrstuvwxyzKLMNOPQRSTUVWXYZ0123456789abcdefghiABCDEFGHIJKLMNOPQRST0123456789jklmnopqrstuvwxyz";
    let randomString = "";
    for (let i = 0; i < count; i++) {
        const randomStringNumber = Math.floor(1 + Math.random() * (letter.length - 1));
        randomString += letter.substring(randomStringNumber, randomStringNumber + 1);
    }
    return randomString
}

module.exports = { generateRandomFamilyId, generatePayments,sendCredentialsEmail,generateRandomPassword}

