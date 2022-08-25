const mongoose = require ("mongoose")

const PostSchema = new mongoose.Schema({

    userId:{
        type:String,
        required:true
    },
    caption:{
        type:String,
        max:100
    },
    image:{
        type:Array
    },
    likes:{
        type:Array,
        default:[]

    }
},{timestamp:true})

module.exports =mongoose.model("Posts",PostSchema)

