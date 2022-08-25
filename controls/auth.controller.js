const config = require("../config/config");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const {
    registerValidation,
    loginValidation,
} = require("../middlewares/validation");
const {error} = require("@hapi/joi/lib/annotate");


const register= async (req, res) => {
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const valid = registerValidation(req.body);
    if (!valid) {
        res.status(400).json(error);
    }
    if (valid) {
        try {

            if(req.body.email==="") return res.send("email is required")
            if(req.body.username==="") return res.send("username is required")
            if(password==="") return res.send("password is required")
            //check if user exist
            const userExist = await User.findOne({ email: req.body.email });

            if (userExist){
                console.log(userExist.password)
                return res.status(401).send("User already exist ,TRY LOGGING IN");
            }
            else {


                //password confirmation
                const matchPassword = confirmPassword === password;
                if (!matchPassword) return res.send("passwords do not match");
                else {

                    //cover password
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(req.body.password, salt);
                    console.log(hashedPassword);

                    // create verification token
                    const token = jwt.sign({ email: req.body.email }, config.mailSecret, {
                        expiresIn: "2h",
                    });
                    console.log(token);
                    //create new user
                    const user = new User({
                        username: req.body.username,
                        email: req.body.email,
                        password: hashedPassword,
                        verificationToken: token,
                    });
                    const savedUser = await user.save();

                    //send verification mail
                    async function main() {
                        let testAccount = await nodemailer.createTestAccount();

                        let transporter = nodemailer.createTransport({
                            host: "smtp.ethereal.email",
                            port: 587,
                            secure: false,
                            auth: {
                                user: testAccount.user,
                                pass: testAccount.pass,
                            },
                        });

                        let info = await transporter.sendMail({
                            from: "test@example.com",
                            to: user.email,
                            subject: "verify account",
                            text: `user id : ${user._id} and verification token : ${user.verificationToken} `, // plain text body
                        });
                        res
                            .status(200)
                            .send(`verification mail has been sent to ${user.email}`);
                        console.log("Message sent: %s", info.messageId);
                        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                    }

                    main().catch(console.error);
                }
            }
        } catch (err) {}
    }
};
const verify= async (req, res) => {
    const id = req.params.id;
    const verificationToken = req.params.verificationToken;
    try {
        const userExist = await User.findById({ _id: id });
        if (!userExist) {
            res.status(400).send("INVALID USER.....PLEEASE REGISTER");
        } else {
            if (userExist.verified) return res.send("this user is already verified");
            if (userExist.verificationToken === verificationToken) {
                userExist.verified = true;
                userExist.verificationToken = null;

                await userExist.save();
                return res.send("user verified ✔");
            }
        }
    } catch (e) {
        console.log(e);
        res.send("unable to verify user");
    }
};
const login =async(req,res)=>{

    const message= "INVALID EMAIL AND PASSWORD"
    const password = req.body.password;
    //confirm if all details are correct
    const valid= loginValidation(req.body)
    if (!valid){
        res.status(400).send("error")
    }
    else{
        try{
            //check if user exist
            const user = await User.findOne({email:req.body.email})

            if(!user||user.verified===false) return res.status(400).send(message)
            else{

                const validPassword= await bcrypt.compare(password, user.password);
                if(!validPassword) return res.status(400).send(message)
                else{
                    console.log("test");
                    const accessToken= jwt.sign({_id:user._id},config.access,{expiresIn:"9h"});

                    res.setHeader('Authorization',`Bearer Token ${accessToken}`)

                    res.send(`accessToken ${accessToken}`);
                    console.log("accessToken :"+ accessToken);
                }
            }


        }catch(err){
            res.send(err)
        }
    }
}

module.exports= {register,verify,login}