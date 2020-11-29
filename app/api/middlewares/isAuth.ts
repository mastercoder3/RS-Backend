import jwt from 'express-jwt';
import config from '../../config';

const getTokenFromHeader = req =>{
    if(
        (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
        (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
    ){
        // console.log(req.headers.authorization.split(' ')[1]);

        return req.headers.authorization.split(' ')[1];
    }
    else{
        return null;
    }
};

const isAuth = jwt({
    secret: config.jwtSecret,
    algorithms: ['HS256'],
    requestProperty : 'token',
    getToken: getTokenFromHeader
});

export default isAuth;