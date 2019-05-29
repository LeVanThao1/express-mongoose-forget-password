const controllerGroup = require('../controllers/groups');
const groupValidation = require('../validations/groups');
const validate = require('express-validation');
const { checkAuthentication } = require('../middlewares/authentication.js');

exports.load = (app) => {
    app.post('/api/v1/groups', [checkAuthentication, validate(groupValidation.createGroup())], controllerGroup.createGroup);
    app.get('/api/v1/groups/:id', [checkAuthentication, validate(groupValidation.getGroup())], controllerGroup.getGroup);
    app.get('/api/v1/groups', checkAuthentication, controllerGroup.getListGroup);
    app.delete('/api/v1/groups/:id', [checkAuthentication, validate(groupValidation.deleteGroup())], controllerGroup.deleteGroup);
    app.put('/api/v1/groups/:id', [checkAuthentication, validate(groupValidation.updateGroup())], controllerGroup.updateGroup);
    app.put('/api/v1/groups/:id/invite', checkAuthentication, controllerGroup.inviteGroup);
    app.put('/api/v1/groups/:id/leave', checkAuthentication, controllerGroup.leaveGroup);
}
