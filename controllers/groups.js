const Group = require('../models/groups.js');
const User = require('../models/user');
const lodash = require('lodash');
const createGroup = async (req, res, next) => {
    try {
        const data = req.body;
        data.author = req.user._id;
        if (data.members.length > 1) {
            data.type = 'group';
        }
        const setMembers = Array.from(new Set(data.members));
        const countGroup = await User.count({ _id : setMembers });
        if (countGroup !== setMembers.length) {
            return next(new Error('HAVE_A_MEMBER_NOT_INVALID'));
        }
        if (!setMembers.includes(loginAuthor)) {
            setMembers.push(loginAuthor);
        }
        const newGroup = new Group({
            author: data.author,
            type: data.type,
            name: data.name,
            members: setMembers
        });
        const createGroup = await newGroup.save();
        return res.status(200).json({
            message: 'Create new group successfully',
            data: createGroup 
        });
    } catch (e) {
        return next(e);
    }
}
const inviteGroup = async (req, res, next) => {
    try {
        const { id } = req.params;
        // const members = Array.from(new Set(req.body.members));
        const invitingGroup = await Group.findOneAndUpdate(
            { _id: id, deleteAt: undefined }, 
            { $push: { members: req.body.members } 
        });
        if (invitingGroup.nModified === 0) {
            return next(new Error('INVITE_NOT_SUCCESSFULLY'));
        }   
        return res.status(200).json({
            message: 'Invite successfully'
        })
    } catch (e) {
        return next(e);
    }
} 
const leaveGroup = async (req, res, next) => {
    const { id } = req.params;
    const user = req.user._id;
    const existGroup = await Group.findOne({ _id: id, deleteAt: undefined }).lean();
    if (!existGroup) {
        return next(new Error('GROUP_NOT_EXISTED'));
    }
    const leavingGroup = await Group.updateOne({ _id: id }, { $pull: { members: user }});
    if (leavingGroup.nModified === 0) {
        return next(new Error('LEAVE_GROUP_FALSE'));
    }
    return res.status(200).json({
        message: 'Leave group sucessfully'
    })
}
const getGroup = async (req, res, next) => {
    try {
        const { id } = req.params;
        const group = await Group.findOne({ _id: id, deleteAt: undefined }).populate([
            {
                path: 'members author',
                select: 'username'
            },
            {
                path: 'lastMessage',
                select: 'author content',
                populate: {
                    path: 'author',
                    select: 'username'
                }
            }  
        ]).lean();
        if (!group) {
            return next(new Error('GROUP_NOT_FOUND'));
        }
        return res.status(200).json({
            message: 'Info Group',
            group
        });
    } catch (e) {
        return next(e);
    }
    
}
const getListGroup = async (req, res, next) => {
    try {
        let { page, limit } = req.query;
        page = page || 1;
        limit = limit || 5;
        const skip = (page - 1)  * limit;
        const listGroup = await Group.find({ deleteAt: undefined })
            .populate([
                {
                    path: 'members author',
                    select: 'username'
                },
                {
                    path: 'lastMessage',
                    select: 'author content',
                    populate: {
                        path: 'author',
                        select: 'username'
                    }
                }  
            ])
            .lean()
            .skip(+skip)
            .limit(+limit);
        if (!listGroup) {
            return next(new Error('NOT_GROUP'));
        }
        return res.status(200).json({
            message: 'List Group',
            listGroup
        })
    } catch (e) {
        return next(e);
    }
}
const deleteGroup = async (req, res, next) => {
    try {
        const { id } = req.params;
        const loginAuthor = req.user._id;
        const existGroup = await Group.findOne({ _id : id }).lean();
        if (!existGroup) {
            return next(new Error('GROUP_NOT_FOUND'));
        }
        if (JSON.stringify(loginAuthor) !== JSON.stringify(existGroup.author)) {
            return next(new Error('CANNOT_DELETE'));
        }
        await Group.updateOne({ _id: id }, { deleteAt: new Date() });
        return res.status(200).json({
            message: 'Delete group successfully ',
            deletedGroup: existGroup
        });    
    } catch (e) {
        return next(e);
    }
}
const updateGroup = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { author, name, type, members, lastMessage} = req.body;
        const loginAuthor = req.user._id;
        let existGroup = await Group.findOne({ _id : id }).and({ deleteAt: undefined }).lean();
        if (!existGroup) {
            return next(new Error('GROUP_NOT_FOUND'));
        }
        if (JSON.stringify(existGroup.author) !== JSON.stringify(loginAuthor)) {
            return next(new Error('CANNOT_UPDATE'));
        }
        if (author) {
            const existUser = await Group.findOne({ _id: id, members: author }).lean();
            if (!existGroup) {
                return next(new Error('AUTHOR_CHANGE_NOT_EXIST_IN_GROUP'));
            }
        }
        // let setMember = Array.from(new Set(members));
        // let existedUsers = await User.count({ deleteAt: undefined, _id: setMember}).lean();
        // if (existedUsers.length !== setMember.length) {
        //     return next(new Error('HAVE_A_MEMBER_NOT_INVALID'));
        // }
        let group = {
            author,
            name,
            members,
            lastMessage,
            type
        };
        lodash.omitBy(group, lodash.isNull);
        const newValues = { $set: group };
        await Group.updateOne({ _id: id }, newValues ).lean();
        return res.status(200).json({
            message: 'Update Group successfully'
        });
    } catch (e) {
        return next(e);
    }
    
}
module.exports = {
    createGroup,
    getGroup,
    getListGroup,
    deleteGroup,
    updateGroup,
    inviteGroup,
    leaveGroup
}