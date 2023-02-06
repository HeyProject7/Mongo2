const jwt = require('jsonwebtoken');
require('dotenv').config();
const verifyJwt = (req, res, next) => {
    authHeader = req.headers.authorization||req.headers.Authorization;
    if (!authHeader ?.startsWith("Bearer ")) return res.status(401);
    console.log(authHeader)// "Bearer token"
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SCREAT, (err, decoded) => {
        if (err) return res.sendStatus(403);// Invallid Token
        req.user = decoded.userInfo.username;
        req.roles = decoded.userInfo.roles;
        next();
    })
}
module.exports=verifyJwt