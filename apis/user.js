const userValidation = require('../validations/user.js');
const controllerUser = require('../controllers/user.js');
const validate = require('express-validation');
const { checkAuthentication } = require('../middlewares/authentication.js');

exports.load = (app) => {
    app.post('/api/v1/users', validate(userValidation.creatUser()), controllerUser.createUser);
    app.post('/api/v1/login', controllerUser.login);
    app.delete('/api/v1/users/:id',[ checkAuthentication, validate(userValidation.deleteUser()) ], controllerUser.deleteUser);
    app.get('/api/v1/users/:id', [ checkAuthentication, validate(userValidation.getUser()) ], controllerUser.getUser);
    app.get( '/api/v1/users', checkAuthentication, controllerUser.getListUser);
    app.put('/api/v1/users/:id', [ checkAuthentication, validate(userValidation.updateUser()) ], controllerUser.updateUser);   
    app.post('/api/v1/users/forget-password', controllerUser.forgetPassword);
    app.post('/api/v1/users/reset-password', controllerUser.resetPassword);
}
