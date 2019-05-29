const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken')
const privateKey = fs.readFileSync(path.resolve(__dirname, '../config/private.key'), 'utf8');
const publicKey = fs.readFileSync(path.resolve(__dirname, '../config/public.key'), 'utf8');
const sign = (payload, options = {}) => {
    options = Object.assign(
        {
            algorithm: 'RS256',
			expiresIn: 60*60 
        },
        options
    );
    return jwt.sign(payload, privateKey, options);
};

const verify = (token, options = {}) => {
    options = Object.assign(
        {
            algorithm: 'RS256'
        },
        options
    );
    return jwt.verify(token, publicKey, options);
};

module.exports = {
    sign,
    verify
};