const bcrypt = require('bcrypt-nodejs')
const User = require('../models/user.js');
const lodash = require('lodash');
const { sign } = require('../helpers/jwt-helper');
const sendMail = require('../helpers/mail-helper');
const randomstring = require('randomstring');
const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userDelete = await User.findOneAndUpdate({ _id: id, deleteAt: undefined }, {$set: { deleteAt: new Date() } }).lean().select('_id username');
        if (!userDelete) {
            return next(new Error('USER_NOT_FOUND'));
        }
        return res.status(200).json({
            message : 'delete user successful',
            data: userDelete
        });
    } catch (e) {
        return next(e);
    }
};

const login = async (req, res, next) => {
    try {
        const { username, password, email } = req.body;
        const salt  = bcrypt.genSaltSync('10');
        const hashPassword = bcrypt.hashSync(password, salt);
        const newUser = {
            username,
            password: hashPassword,
            email
        };
        const user = await User.findOne({
            username,
        });
        if (!user) {
            return next(new Error('USERNAME_NOT_EXISTED'));
        }
        
        const isValidatePassword = bcrypt.compareSync(password, user.password);
        if (!isValidatePassword) {
            return next(new Error('PASSWORD_IS_INCORRECT'));
        }
        const token = sign({ _id: user._id });
        return res.status(201).json({
            message: "login successfully",
            access_token: token
        });
    } catch (e) {
        return next(e);
    }
};
const createUser = async (req, res, next) => {
    try {
        const {
            username,
            password,
            email,
            gender
        } = req.body;
        const salt = bcrypt.genSaltSync(2);
        const hashPassword = bcrypt.hashSync(password, salt);
        const newUser = new User({
            username,
            password : hashPassword,
            email,
            gender
        });
        const creatUser = await newUser.save();
        return res.status(200).json({
            message: "create user  successfully",
            creatUser
        })
    } catch (e) {
        return next(e);
    };
}
const getListUser = async (req, res, next) => {
    try {
        let { page, limit } = req.query;
        page = page || 1;
        limit = limit || 5;
        const skip = (page - 1)  * limit;     
        const users = await User.find({ deleteAt: undefined })
            .lean()
            .select('-password')
            .skip(+skip)
            .limit(+limit);
        if (!users) {
            return next(new Error('NO_DATA'));
        }
        return res.status(200).json({
            message: 'List users',
            data: users
        });
    } catch (e) {
        return next(e);
    }
};

const getUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ _id: id, deleteAt: undefined }).select('-password').lean();        
        if (!user) {
            return next(new Error('USER_NOT_FOUND'));
        }
        return res.status(200).json({
            message: 'User',
            data: user
        });
    } catch (e) {
        return next(e);
    }
};


const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const {
            username,
            password,
            email,
            gender
        } = req.body;
        
        const salt = bcrypt.genSaltSync(2);
        const hashPassword = bcrypt.hashSync(password, salt);
        const newValues = {
            username,
            password: hashPassword,
            email,
            gender
        }
        lodash.omitBy(newValues, lodash.isNull);
        const updateInfo = { $set: newValues };
        const userUpdate = await User.findOneAndUpdate({_id: id, deleteAt: undefined }, updateInfo, {
            new: true
        }).lean();
        if (!userUpdate) {
            return next(new Error('USER_NOT_FOUND'));
        }
        return res.status(200).json({
            message : 'update successful',
            data: userUpdate,
            data_update: newValues
        });
    } catch (e) {
        return next(e);
    }
};

const forgetPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const existedEmail = await User.findOne({ email }).lean();
        if (!existedEmail) {
            return next(new Error('EMAIL_OF_USER_NOT_FOUND'));
        }
        const code = randomstring.generate({
            length: 6,
            charset: 'alphanumeric',
            capitalization: 'uppercase'
        });
        await sendMail(email, code);
        await User.updateOne({ email }, { verifyCode: code, verifyCodeExpiredAt: new Date() });
        return res.status(200).json({
            message: 'We sent you a mail'
        });
    } catch (e) {
        return next(new Error(e));
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const { email, code, newPassword } = req.body;
        const user = await User.findOne({ email }).lean().select('verifyCode verifyCodeExpiredAt');
        if (!user) {
            return next(new Error('EMAIL_NOT_INVALID'));
        }
        if (user.verifyCode === null) {
            return next(new Error('YOU_HAVE_NOT_REQUESTED_FORGET_PASSWORD')); 
        }
        if (code !== user.verifyCode) {
            return next(new Error('CODE_NOT_INVALID'));
        }
        if (new Date() - user.verifyCodeExpiredAt > 1000*60*5) {
            return next(new Error('CODE_EXPIRED'));       
        }
        const salt = bcrypt.genSaltSync(2);
        const hashPassword = bcrypt.hashSync(newPassword, salt);
        await User.updateOne({ email }, { password: hashPassword, verifyCode: undefined });
        return res.status(200).json({
            message : 'change password successful',
        });
    } catch (error) {
        return next(error);
    } 
};
module.exports = {
    deleteUser,
    createUser,
    login,
    getListUser,
    getUser,
    updateUser,
    forgetPassword,
    resetPassword
};