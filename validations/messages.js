const Joi = require('joi');
const condition = {
    _id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    // author: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    group: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    content: Joi.string().min(3).max(500)
}
const createMessage = () => {
    return {
        body: {
            group : condition.group.required(),
            content: condition.content.required()
        }
    };
}
const deleteMessage = () => {
    return {
        params: {
            id: condition._id.required()
        }
    }
}

const updateMessage = () => {
    return {
        body: {
            // author: condition.author,
            group : condition.group,
            content: condition.content
        },
        params: {
            id: condition._id.required()
        }
    }
}
const getMessage = () => {
    return {
        params: {
            id: condition._id.required()
        }
    }
};
module.exports = {
    getMessage,
    createMessage,
    updateMessage,
    deleteMessage
}
