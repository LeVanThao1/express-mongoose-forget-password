const { verify } = require('../helpers/jwt-helper');

exports.checkAuthentication = (req, res, next) => {
    try {
        let token = req.body.token || req.params.token || req.headers.token;
        let queryToken = req.query.token;     
        // if (!token) {
        //     return next(new Error('AUTHENTICATION_FAILED'));
        // }
        if (!queryToken) {
            const [ prefixToken, accessToken ] = token.split(' ');
            if (prefixToken !== 'Bearer') {
                return next(new Error('JWT_INVALID_FORMAT'));
            }
            token = accessToken;
        } else {
            token = queryToken;
        }
        const verifiedData = verify(token);
        req.user = verifiedData;
        console.log(req.user);
        return next();
    } catch (e) {
        return next(e);
    }
};