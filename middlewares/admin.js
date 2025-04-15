const jwt = require("jsonwebtoken");
const { JWT_SECRET_ADMIN } = require("../config");

function adminMiddleware(req, res, next){
    const token = req.body.token;

    const decoded = jwt.verify(token, JWT_SECRET_ADMIN);

    if(decoded){
        req.creatorId = decoded.id;
        next();
    }
    else{
        res.json({
            message: "You first need singin"
        })
    }
}

module.exports = {
    adminMiddleware
}
