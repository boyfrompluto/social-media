const router = require("express").Router();
const verifyToken = require("../middlewares/verifyToken");
const multer = require("multer");
const path = require("path")
const {createNewPost,likePost, deletePost,viewAllUserPost, timelinePost} = require("../controls/post.controller");


const userStorage = multer.diskStorage({
    destination: 'postUploads',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));


    }

});
const uploads = multer({
    storage: userStorage
}).array("images", 3);

router.post("/hello", (req, res) => {
    res.send("hello")
})
router.put("/createNewPost/:token", uploads,verifyToken, createNewPost);
router.put("/likePost/:token/:postId",verifyToken,likePost);
router.delete("/deletePost/:token/:postId",verifyToken,deletePost);
router.get("/viewuserpost/:token",verifyToken,viewAllUserPost);
router.get("/timeline/:token",verifyToken,timelinePost)
module.exports = router;