const jwt = require('jsonwebtoken');
const config = require('./config');

function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    let token;
    //check if header exists
    if(!authHeader) {
        return res.status(401).json({message: 'Unauthorized: No Authorization header'});
    }

    const parts = authHeader.split(' ');
    
    // check if token is used from backend or frontend, set token to header directly if its tested from backend, else the second part of the response sent from frontend
    if (parts.length !== 2) {
        token = authHeader;
    } else if (parts.length === 2) {
        token = parts[1];
    }
    
    //authenticate token and call next if the token is valid  
    jwt.verify(token, config.jwtKey, (err, user) => {
        if(err) {
            return res.status(401).json({message: 'Unauthorized token', err});
        }
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;