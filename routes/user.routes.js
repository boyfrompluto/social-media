const router = require("express").Router();
const verifyToken = require("../middlewares/verifyToken");
const {reset,deleteUser, viewUserDetails,editUserDetails,changeUserPassword,viewAllUsers,practice} =require("../controls/user.controller")
const multer = require("multer");
const path= require("path")

const userStorage = multer.diskStorage({
    destination: 'photoUploads',
    filename: (req, file, cb) => {
        cb(null, Date.now()+path.extname(file.originalname));


    }

});
const upload = multer({
    storage: userStorage
}).single("image");


router.get("/test1", (req, res) => {
    res.send("hello");
});
router.post("/reset",reset);
router.get("/view/:token",verifyToken,viewUserDetails);
router.post("/edit/:token",upload,verifyToken,editUserDetails);
router.get("/viewUsers/:token",verifyToken,viewAllUsers)
router.post("/changePassword/:token",verifyToken,changeUserPassword);
router.delete("/deleteUser/:token/:id",verifyToken,deleteUser);
router.put("/practice/:token",verifyToken,practice)
module.exports = router;
