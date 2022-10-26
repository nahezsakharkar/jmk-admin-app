const router = require("express").Router();
const Admin = require("../models/Admin");
const Member = require("../models/Member");
const CryptoJs = require("crypto-js");
const Jwt = require("jsonwebtoken");
const config = require("../config/config");

router.post('/admin/register', async (req, res) => {
    const newAdmin = {
        name : req.body.name,
        email: req.body.email,
        contact : req.body.contact,
        position : req.body.position,
        admin_for : req.body.admin_for,
        password : req.body.password,
        isDeleted : false
    };
    try {
        const savedAdmin = await Admin.create(newAdmin);
        const {password,...others} = savedAdmin.dataValues;
        res.status(201).json(others);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.post('/admin/login', async (req, res) => {
    try {
        const admin = await Admin.findOne({ "where" :  {email: req.body.email,"isDeleted":false} });
        if (!admin) {
            res.status(401).json("No User Found")
        }
        else {
            const dbPassword = admin.password;
            if (dbPassword == req.body.password) {

                const accessToken = Jwt.sign({
                    id: admin.id,
                    isAdmin: true,
                    position : admin.position
                }, 
                config.JWT_SECRET, 
                { expiresIn: "3d" });

                //add accessToken to response body
                const {password, ...others } = admin.dataValues;
                res.status(200).json({...others,accessToken});
            } else {
                res.status(401).json("Wrong Credentials");
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
});

router.post('/member/login', async (req, res) => {
    try {
        const member = await Member.findOne({ "where" :  {email: req.body.email,"isDeleted":false} });
        if (!member) {
            res.status(401).json("No User Found")
        }
        else {
            const dbPassword = member.password;
            if (dbPassword == req.body.password) {

                const accessToken = Jwt.sign({
                    id: member.id,
                    isAdmin: false,
                }, 
                config.JWT_SECRET, 
                { expiresIn: "3d" });
                //add accessToken to response body
                //const {password, ...others } = member.dataValues;
                // res.status(200).json({...others,accessToken});
                res.status(200).json({...member.dataValues,accessToken});
            } else {
                res.status(401).json("Wrong Credentials");
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
});

module.exports = router;

