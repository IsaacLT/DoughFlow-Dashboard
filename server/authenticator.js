const jwt = require('jsonwebtoken');
const config = require('./config');

function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    
    //check if header exists
    if(!authHeader) {
        return res.status(401).json({message: 'Unauthorized: No Authorization header'});
    }

    const parts = authHeader.split(' ');
    
    //check so header is in correct format, and first part of header is "Bearer"
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({message: 'Unauthorized: Invalid Authorization header format'});
    }
    
    //put the actual token for authentication in variable 
    const token = parts[1];
    
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