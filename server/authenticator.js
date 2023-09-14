const jwt = require('jsonwebtoken');
const config = require('./config');

function authenticateToken(req, res, next) {
    const token = req.headers.authorization;
    console.log(token);

    if(!token) {
        return res.status(401).json({message: 'Unauthorized token', token});
    }
    jwt.verify(token, config.jwtKey, (err, user) => {
      if(err) {
      return res.status(401).json({message: 'Unauthorized token', token});
      }
        req.user = user;
        console.log(user);
        next();
    });
}

module.exports = authenticateToken;