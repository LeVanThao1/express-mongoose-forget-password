const Message = require('../models/messages');
const Group = require('../models/groups');
const sendMessage = async (req, res, next) => {
    try {
        const { content, group } = req.body;
        const loginAuthor = req.user._id;

        const existGroup = await Group.findOne(
            {
                _id: group, 
                members: loginAuthor,
                deleteAt: undefined 
            }).lean();
        if (!existGroup) {
            return next(new Error('NOT_EXISTED_GROUP')); 
        }
        const newMessage = new Message({
            author: loginAuthor,
            content,
            group
        });
        const sendMessage = await newMessage.save();
        await Group.updateOne({ _id: group }, { lastMessage: sendMessage._id });
        return res.status(200).json({
            message: 'Send Message successfully',
            sendMessage
        });
    } catch (e) {
        return next(e);
    }
}
const getMessage = async (req, res, next) => {
    try {
        const { id } = req.params;
        const message = await Message.findOne({ _id: id }).lean().populate({
            path: 'author',
            select: 'username'
        });
        if (message) {
            return next(new Error('NOT_EXISTED_MESSAGE'));
        }
        return res.status(200).json({
            message: 'message ',
            message
        });
    } catch (e) {
        return next(e);
    }
}
const getListMessage = async (req, res, next) => {
    try {
        let { page, limit } = req.query;
        page = page || 1;
        limit = limit || 5;
        const skip = (page - 1)  * limit;
        const messages = await Message.find({ deleteAt: undefined })
            .lean()
            .populate({
                path: 'author',
                select: 'username'
            })
            .skip(+skip)
            .limit(+limit);
        if (!messages) {
            return next(new Error('NOT_MESSAGES'));
        }
        return res.status(200).json({
            message: 'List Message ',
            messages
        });   
    } catch (e) {
        return next(e);
    }
}
const getListMessageOfGroup = async (req, res, next) => {
    try {
        const author = req.user._id;
        const { id } = req.params;
        let { page, limit } = req.query;
        page = page || 1;
        limit = limit || 5;
        const skip = (page - 1)  * limit;
        const existGroup = Group.findOne({ _id: id, members: author, deleteAt: undefined })
            .lean()
            .select('name');
        if (!existGroup) {
            return next(new Error('NOT_EXISTED_GROUP'));
        }
        const messages = await Message.find({ group: id, deleteAt: undefined })
            .lean()
            .skip(+skip)
            .limit(+limit)
            .select('content author createdAt')
            .populate({
                path: 'author',
                select: 'username'
            })
            .sort({'createAt': 1 });
        if (!messages) {
            return next(new Error('NOT_MESSAGES'));
        }
        return res.status(200).json({
            message: 'List Message ',
            messages
        });   
    } catch (e) {
        return next(e);
    }
}
const deleteMessage = async (req, res, next) => {
    try {
        const { id } = req.params;
        const loginAuthor = req.user._id
        const existMessage = await Message.findOne({ _id: id, deleteAt: undefined })
            .lean()
            .select('author');
        if (!existMessage) {
            return next(new Error('NOT_FOUND_MESSAGE')); 
        }
        if (existMessage.author.toString() !== loginAuthor.toString()) {
            return next(new Error('YOU_DO_NOT_HAVE_PERMISSION_TO_DELETE_THIS_MESSAGE'));
        }
        await Message.updateOne({ _id: id }, { $set: { deleteAt: new Date() } });
        return res.status(200).json({
            message: 'Delete Group successfully'
        });
    } catch (e) {
        return next(e);
    }
}
const updateMessage = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const loginAuthor = req.user._id;
        const updatingMessage = await Message.findOne({ _id: id, deleteAt: undefined })
            .lean()
            .select('author');
        if (!updatingMessage) {
            return next(new Error('NOT_FOUND_MESSAGE'));
        }
        if (updatingMessage.author.toString() !== loginAuthor.toString()) {
            return next(new Error('YOU_DO_NOT_HAVE_PERMISSION_TO_UPDATE_THIS_MESSAGE'));
        }
        await Message.updateOne({ _id: id }, { content: content });
        return res.status(200).json({
            message: 'Update successfully'
        })
    } catch (e) {
        return next(e);
    }
}
module.exports = {
    sendMessage,
    getListMessage,
    getMessage,
    deleteMessage,
    getListMessageOfGroup,
    updateMessage
}