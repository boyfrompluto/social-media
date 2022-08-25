const router = require("express").Router();
const verifyToken = require("../middlewares/verifyToken");
const {followFriend, unfollowFriend} = require("../controls/followings.controller");


router.put("/follow/:token/:id", verifyToken, followFriend);
router.put("/unfollow/:token/:id", verifyToken, unfollowFriend);


module.exports = router