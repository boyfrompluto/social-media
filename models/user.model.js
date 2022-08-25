const mongoose = require ("mongoose")

const UserSchema = new mongoose.Schema({
    isAdmin:{
        type:Boolean,
        default: false,
    },
    username:{
        type: String,
        required:true,
        unique:true
    },
    firstName:{
        type: String,
        default:"",


    },
    lastName:{
        type: String,
        default:"",



    },
    password:{
        type: String,
        required:true,
        select: true,
        min: 6 ,

    },
    email:{
        type: String,
        required:true,
        min: 6,
        unique: true

    },
    verificationToken:{
        type:String,
        default: null
    },
    profileImage:{
        type:String,
        default:""

    },
    verified:{
        type:Boolean,
        default:false
    },
    followers:{
        type:Array,
        default:[]
    },
    following:{
        type:Array,
        default:[]
    },

    date: {
        type: Date,
        default: Date.now
    }
},{timestamp:true})

module.exports =mongoose.model("User",UserSchema)
// module.exports= privateFields
