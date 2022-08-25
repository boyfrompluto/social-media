const router = require("express").Router();
const {register,verify,login} =require("../controls/auth.controller")





//register user
router.post("/register",register);
//verify user
router.post("/verify/:id/:verificationToken",verify);
//login user
router.post("/login",login);

module.exports = router;
