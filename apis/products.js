const productValidation = require('../validations/products.js');
const productController = require('../controllers/products.js');
const validate = require('express-validation');
const { checkAuthentication } = require('../middlewares/authentication.js');


exports.load = function(app) {
    app.post('/api/v1/products',validate(productValidation.createProduct()), productController.createProduct);
    app.delete('/api/v1/products/:id', [checkAuthentication, validate(productValidation.deleteProduct())], productController.deleteProduct);
    app.get('/api/v1/products/:id', [checkAuthentication, validate(productValidation.getProduct())], productController.getProduct);
    app.get('/api/v1/products', checkAuthentication, productController.getListProduct);
    app.put('/api/v1/products/:id', [checkAuthentication, validate(productValidation.updateProduct())], productController.updateProduct);
};
