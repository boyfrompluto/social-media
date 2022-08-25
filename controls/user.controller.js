const User = require("../models/user.model");
const nodemailer = require("nodemailer");
const _ = require("lodash");
const config = require("../config/config");
const bcrypt = require("bcrypt");
const {editProfile} = require("../middlewares/validation");
const { error } = require("@hapi/joi/lib/base");



const reset= async (req, res) => {
    const message = "INVALID USER....PLEASE SIGNUP";
    const email = req.body.email;
    const user1 = await User.findOne({ email: email });
    if (!user1) {
        res.send(message);
    } else {
        const newPassword = config.newPassword;
        console.log(newPassword);
        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newPassword, salt);
        const reset = await User.findOneAndUpdate(
            { email: req.body.email },
            { password: newHashedPassword }
        );
        if (!reset) {
            res.status(400).send("unable to reset password");
        } else {
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
                    to: user1.email,
                    subject: "password reset",
                    text: `this is your new password ${newPassword} `, // plain text body
                });
                res
                    .status(200)
                    .send(` your new password has been sent to ${user1.email}`);
                console.log("Message sent: %s", info.messageId);

                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            }

            main().catch(console.error);
        }
    }
};
const viewUserDetails= async (req, res) => {

    const _id = req.decode._id;
    const user = await User.findOne({ _id: _id });
    if (!user) {
        res.send("access denied");
    } else {

        const userDetails = _.omit(user.toJSON(), config.privateFields);
        res.send(userDetails);
    }
};
const editUserDetails=async(req,res)=>{


    const valid= editProfile(req.body);
    if(!valid){
        res.send(error)
    }else{
        const _id = req.decode._id;
        const user = await User.findOne({ _id: _id });
        if (!user) {
            res.send("access denied");
        } else {
            let profileImage=req.file;
            let username=req.body.username;
            let firstName=req.body.firstName;
            let lastName=req.body.lastName;

            if(username===""){
                username=user.username
            }
            if(firstName===""){
                firstName=user.firstName
            }
            if(lastName===""){
                lastName=user.lastName
            }
            if(profileImage===""){
                profileImage=user.profileImage
            }
            const update={
                username:username,
                firstName:firstName,
                lastName:lastName,
                profileImage:profileImage.path

            }

            User.findByIdAndUpdate({_id},{update},(error,data)=>{
                if(error) return res.send("error")
                else{
                    res.send("updated")
                    console.log(data)
                }
            })

        }
    }
};
const changeUserPassword=async(req,res)=>{

    const _id = req.decode._id;
    const user = await User.findOne({ _id: _id });
    if(!user) return res.send('ACCESS DENIED')
    else{
        const password = req.body.password;
        const validPassword= await bcrypt.compare(password, user.password);
        if(!validPassword) res.send("incorrect password")
        else{
            const newPassword= req.body.newPassword;
            const confirmNewPassword= req.body.confirmNewPassword;
            if(newPassword!==confirmNewPassword) return res.send("passwords do not match")
            else{
                const salt = await bcrypt.genSalt(10);
                const newHashedPassword = await bcrypt.hash(newPassword, salt);
                const changePassword= await User.findOneAndUpdate({_id},{password:newHashedPassword});
                if(!changePassword) return res.status(400).send("unable to change password at the moment")
                else return res.send("password changed successfully")
            }
        }

    }


};
const deleteUser=async(req,res)=>{

    const admin= await User.findById({_id:req.decode._id})
    if(!admin) return res.send("access denied");
    if(admin.isAdmin===true){

        const id= req.params.id
        await User.findByIdAndDelete({_id:id})
        res.send("deleted")

    }else{
        res.send("access denied")
    }
};
const viewAllUsers=async(req,res)=>{

    const admin= await User.findById({_id:req.decode._id})
    if(!admin) return res.send("access denied");
    if(admin.isAdmin===true){

        const users=await User.find();
        res.send(users)

    }else{
        res.send("access denied")
    }
};
const practice=async (req,res)=>{
    // const user = await User.findByIdAndUpdate({_id:req.decode._id},{$set:req.body})
    // if(!user) return res.status(500).json("cant put")
    // else return res.status(200).json("updated")

    // const d = req.query.p||0;
    // const o= 1;
    // const datas = await User.find().sort({username:1}).skip(d*o).limit(o);
    // res.send(datas)

};
module.exports={reset,viewUserDetails,editUserDetails,changeUserPassword,practice,deleteUser,viewAllUsers};