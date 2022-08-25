const User = require("../models/user.model")

const followFriend = async (req, res) => {
    console.log(req.decode._id)
    if (req.decode._id !== req.params.id) {
        const userId = await User.findById({_id: req.decode._id});
        if (!userId) return res.status(403).json("access denied")
        const friendId = await User.findById({_id: req.params.id});
        if (!friendId) return res.status(403).json("user does not exist");
        if (!friendId.followers.includes(req.decode._id)) {
            await friendId.updateOne({$push: {followers: req.decode._id}});
            await userId.updateOne({$push: {following: req.params.id}})
            res.status(200).json(`successfully followed ${friendId.username}`)
        } else {
            res.status(403).json(`you already follow ${friendId.username}`)
        }
    } else {
        res.status(405).json("users can not follow their selves")
    }

};
const unfollowFriend = async (req, res) => {
    console.log(req.decode._id)
    if (req.decode._id !== req.params.id) {
        const userId = await User.findById({_id: req.decode._id});
        if (!userId) return res.status(403).json("access denied")
        const friendId = await User.findById({_id: req.params.id});
        if (!friendId) return res.status(403).json("user does not exist");
        if (friendId.followers.includes(req.decode._id)) {
            await friendId.updateOne({$pull: {followers: req.decode._id}});
            await userId.updateOne({$pull: {following: req.params.id}})
            res.status(200).json(`successfully unfollowed ${friendId.username}`)
        } else {
            res.status(403).json(`you do not follow ${friendId.username}`)
        }
    } else {
        res.status(405).json("users can not unfollow their selves")
    }

};
module.exports = {followFriend, unfollowFriend}
