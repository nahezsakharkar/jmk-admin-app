const Jwt = require("jsonwebtoken");
const config = require("../config/config");

//AUTHENTICATION FOR ALL USERS
//Check for accesstoken in headers
//verify token 
//if verification is successful set the request user to the user object from jwt token
const verifyToken = (req,res,next) =>{
    const authHeader = req.headers.token;
    if(authHeader){
        const token = authHeader.split(' ')[1];
        Jwt.verify(token,config.JWT_SECRET,(err,user)=>{
            if(err){
                res.status(403).json("Token is not valid");
            }else{
                req.user = user;
                next();
            }
        });
    }else{
        return res.status(401).json("User not authenticated");
    }
};

//authentication for admin
const verifyTokenAndAdmin = (req,res,next) => {
    verifyToken(req,res,()=>{
        //if current user is logged or if it is admin
        if(req.user.isAdmin){
            next();
        }else{
            res.status(403).json("permission denied")
        }
    });
}

module.exports = {verifyToken,verifyTokenAndAdmin}