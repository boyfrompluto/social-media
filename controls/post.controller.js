const User = require("../models/user.model")
const Posts = require("../models/post.model")


const createNewPost = async(req,res)=>{
        const ID = req.decode._id;
        const imagePost= req.files;
        const user= await User.findById({_id:ID});
        if(!user) return res.status(405).json("access denied")
        const post= new Posts({
            userId:ID,
            caption:req.body.caption,
            image:imagePost
        })
        const savedPost =await post.save();
        res.status(200).json(`post created \n ${savedPost}`)
};
const likePost= async (req,res)=>{
    const ID= req.decode._id;
    const postId= req.params.postId;
    const user= await User.findById({_id:ID});
    if(!user) return res.status(405).json("access denied")
    const findPost= await Posts.findById({_id:postId});
    if(!findPost)return res.status(405).json("post does not exist")
    if(!findPost.likes.includes(ID)){
        await findPost.updateOne({$push:{likes:ID}})
        res.status(200).json("post liked")

    }else{
        await findPost.updateOne({$pull:{likes:ID}})
        res.status(200).json("post unliked")
    }
};
const deletePost= async (req,res)=>{
    let ID= req.decode._id;
    const postId=req.params.postId;
    const user= await User.findById({_id:ID})
    if(!user) return res.status(405).json("access denied")
    const findPost= await Posts.findById({_id:postId});
    if(!findPost) return res.status(405).json("post does not exist");
    if(user.isAdmin===true||findPost.userId===ID){
        const delPost= await Posts.findByIdAndDelete({_id:postId});
        if(!delPost) return res.status(405).json("unable to delete post")
        else return res.status(200).json("post deleted")



    }
};
const viewAllUserPost= async (req,res)=>{
    let ID= req.decode._id;
    const user= await User.findById({_id:ID})
    if(!user) return res.status(405).json("access denied")
    const userPosts= await Posts.find({userId:ID});
    if(userPosts) return res.status(200).json(userPosts)
    else return res.status(200).json("no post found")
};
const timelinePost= async (req,res)=>{
    let ID= req.decode._id;
    const user= await User.findById({_id:ID})
    if(!user) return res.status(405).json("access denied")
    const userPost= await Posts.find({userId:ID})
    const folllowersPost = await  Promise.all(
        user.following.map((friendId)=>{
           return Posts.find({userId:friendId});
        })
    );
    res.json(userPost.concat(...folllowersPost))
}
module.exports= {createNewPost,likePost,deletePost,viewAllUserPost,timelinePost};

