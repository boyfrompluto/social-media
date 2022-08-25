const dotenv= require("dotenv")
dotenv.config()


const config={
    port:process.env.PORT,
    dbUri:process.env.dbUr,
    newPassword: `user${Math.floor(Math.random() * 110555)}`,
    smtp: {
        user: 'dhm75nour7bxmucr@ethereal.email',
        pass: 'Jp88hzZ7D1CqRuVRs7',
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
    },
    mailSecret:process.env.MAIL_SECRET,
    access:process.env.ACCESS_TOKEN,
    refresh:process.env.REFRESH_TOKEN,

    privateFields : [
        "password",
        "__v",
        "verificationToken",
        "resetToken",
        "iat",
        "isAdmin",
        "_id",
        "verified"
    ]
}



module.exports = config





