const User = require('../model/User')

// JWT PKGS
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcrypt')

const handleLogin = async(req, res) => {
    const user = req.body.username;
    const pwd = req.body.password;
    if (!user || !pwd) return res.send("Enter Data Correctly ");
    const foundUser = await User.findOne({ username: user }).exec();
    // 401 = Unauthrised
    if (!foundUser) return res.status(401);//.send("<h1>User Not Found!</h1>");
    const matchPass = await bcrypt.compare(pwd, foundUser.password)
    if (matchPass) {
        // Grab Roles
        const roles = Object.values(foundUser.roles)
        // JWT
        const accessToken =jwt.sign(
            {
               // Private JWT Client=>jwt.io
                userInfo: {
                    "username": foundUser.username,
                    "roles":roles// only sending codes not like user,admin
                }
            },
        process.env.ACCESS_TOKEN_SCREAT,
                {"expireIn":"30s"}
            );
        const refreshToken =jwt.sign(
            { "username" : foundUser.username },
        process.env.REFRESH_TOKEN_SCREAT,
                {"expireIn":"1d"}
        );
        // Saving Tokens
        foundUser.refreshToken = refreshToken;
        const result = await User.save();
        console.log(result);
        // res.cookie('jwt', refreshToken, { httpOnly: true ,sameSite:"None",secure:true,maxAge:24*60*60*1000});
        res.cookie('jwt', refreshToken, { httpOnly: true ,sameSite:"None",maxAge:24*60*60*1000});
        res.json({accessToken})
        return res.sendFile("../views/Tools.html");
    }
    else return res.sendFile('../views/404Page.html');
}
module.exports={handleLogin}
