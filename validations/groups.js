const Joi =  require('joi');
const condition = {
    _id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    author: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    members: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
    lastMessage: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    name: Joi.string().alphanum().min(3).max(50),
    type: Joi.string().valid('individual', 'group')

}
const createGroup = () => {
    return {
        body: {
            members : condition.members.required(),
            name: condition.name.required(),
            type: condition.type.required(),
        }
    };
}
const deleteGroup = () => {
    return {
        params: {
            id: condition._id
        }
    }
}

const updateGroup = () => {
    return {
        body: {
            members: condition.members,
            lastMessage: condition.lastMessage,
            name: condition.name,
        }
    }
}
const getGroup = () => {
    return {
        params: {
            id: condition._id.required()
        }
    }
};
module.exports = {
    getGroup,
    createGroup,
    updateGroup,
    deleteGroup
}
