const Joi = require('joi');

const condition = {
    name: Joi.string().alphanum().min(3).max(40),
    _id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    price: Joi.number().integer().min(1000).max(100000000),
    color: Joi.array().items(Joi.string().alphanum().min(3).max(30)),
    isAvailable: Joi.boolean(),
    payload: Joi.object().keys({ 
        releasedAt: Joi.date(),
        expiredAt: Joi.date().min('now').greater(Joi.ref('releasedAt')),   
       
    })
};
 
const createProduct = () => {
    return {
        body: {
            name: condition.name.required(),
            userId: condition._id.required(),
            price: condition.price.required(),
            color: condition.color.required(),
            isAvailable: condition.isAvailable.required(),
            payload: condition.payload.required()
        }
    };
}

const deleteProduct = () => {
    return {
        params: {
            id: condition._id.required()
        }
    };
}

const getProduct = () => {
    return {
        params: {
            id: condition._id.required()
        }
    };
}

const updateProduct = () => {
    return {
        body: {
            name: condition.name,
            userId: condition._id,
            price: condition.price,
            color: condition.color,
            isAvailable: condition.isAvailable,
            payload: condition.payload
        },
        params: {
            id: condition._id.required()
        }
    };
}

module.exports = {
    createProduct,
    deleteProduct,
    getProduct,
    updateProduct
};