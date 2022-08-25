const jwt= require("jsonwebtoken")
const config = require("../config/config");


const verifyToken =(req,res,next)=>{
    const accessToken = req.params.token;
    jwt.verify(accessToken, config.access,(error,decode)=>{
        if(error) return res.send("access denied")
        else{
            req.decode=decode
            next()
        }
    })

};

module.exports =verifyToken