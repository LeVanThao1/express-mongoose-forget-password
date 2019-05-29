
const controllerMessage = require('../controllers/messages');
const messageValidation = require('../validations/messages');
const validate = require('express-validation');
const { checkAuthentication } = require('../middlewares/authentication.js');

exports.load = (app) => {
    app.post('/api/v1/messages', [checkAuthentication, validate(messageValidation.createMessage())], controllerMessage.sendMessage);
    app.get('/api/v1/messages/:id', [checkAuthentication, validate(messageValidation.getMessage())], controllerMessage.getMessage);
    app.get('/api/v1/messages/groups/:id', checkAuthentication, controllerMessage.getListMessageOfGroup);
    app.get('/api/v1/messages', checkAuthentication, controllerMessage.getListMessage);
    app.delete('/api/v1/messages/:id', [checkAuthentication, validate(messageValidation.deleteMessage())], controllerMessage.deleteMessage);
    app.put('/api/v1/messages/:id',[checkAuthentication, validate(messageValidation.updateMessage())], controllerMessage.updateMessage);
}
