const express = require("express");
const mongoose = require("mongoose");
const config= require("./config/config");
const helmet = require("helmet");
const morgan= require("morgan");
const user= require("./routes/user.routes");
const auth= require("./routes/auth.routes");
const follow= require("./routes/followings.routes")
const post = require("./routes/post.routes")


const app = express();

const theDB = "mongodb://localhost:27017/socialmedia" || config.dbUri;
mongoose.connect(theDB).then(()=>console.log('connected to db')).catch((err)=>console.log(err))


app.use(express.json());
app.use(helmet())
app.use(morgan("common"))
app.use("/api/authen",auth);
app.use("/api/user",user)
app.use("/api/followings",follow)
app.use("/api/post",post)



app.listen(config.port,()=>{
    console.log("connected to port")
})
