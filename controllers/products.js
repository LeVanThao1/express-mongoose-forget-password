const { ObjectId } = require('mongodb');
const Product = require('../models/product.js');
const User = require('../models/user.js');
const lodash = require('lodash');

const createProduct = async (req, res, next) => {
    try {
        const {
            name,
            userId,
            price,
            color,
            isAvailable,
            payload
        } = req.body;
        const existedUser = await User.findOne({_id: req.body.userId}).lean();
        if (!existedUser) {
            return next(new Error('USER_NOT_FOUND'));
        }
        
        const product = new Product({
            name,
            userId,
            price,
            color,
            isAvailable,
            payload
        });
        const savedProduct = await product.save();
        return res.status(200).json({
            message: 'Create new product successfully',
            savedProduct
        });
    } catch (e) {
        return next(e);
    }
}

const deleteProduct = async (req, res, next) => {
    try {   
        const { id } = req.params;
        const deletingProduct = await Product.findOneAndDelete({_id: ObjectId(id)}).lean().select('_id name');
        if (!deletingProduct) {
            return next(new Error('PRODUCT_NOT_FOUND'));
        }
        return res.status(200).json({
            message: 'Delete product succesfully',
            deletedProductData : deletingProduct 
        });
    } catch (e) {
        return next(e);
    }
}

const getProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const getProduct = await Product.findOne({ _id: id });
        if (!getProduct) {
            return next(new Error('PRODUCT_NOT_FOUND'));
        }
        const getUserOfProduct = await User.find({ _id: getProduct.userId }).lean().populate({
            path: 'userId',
            select: 'username'
        }).select('_id name isVailable');
        return res.status(200).json({
            message : 'Info Product of id : ' + id ,
            data : getUserOfProduct
        });
    } catch (e) {
        return next(e);
    }
};

const getListProduct = async (req, res, next) => {
    try {
        const getProducts = await Product.find().populate({
            path: 'userId',
            select: 'username'
        }).lean().select('_id name isAvailable');
        if (!getProducts) {
            return next(new Error('NOT_DATA'));
        }
        return res.status(200).json({
            message: 'List products',
            getProducts
        });
    } catch (e) {
        return next(e);
    }
}

const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const existedUser = User.findOne({_id: req.body.userId}).lean();
        if (!existedUser) {
            return next(new Error('USERID_DOES_NOT_EXIST'));
        }
        const newValues = req.body;
        lodash.omitBy(newValues, lodash.isNull);
        const updateInfo = {$set: newValues};
        const updatingProduct = await Product.findOneAndUpdate({_id: ObjectId(id)}, updateInfo).lean();
        if (!updatingProduct) {
            return next(new Error('PRODUCT_NOT_FOUND'));
        }

        return res.status(200).json({
            message: 'Update product successfully',
            oldData: updatingProduct,
            dataChanges: newValues
        });
    } catch (e) {
        return next(e);
    }
}

module.exports = {
    createProduct,
    deleteProduct,
    getProduct,     
    getListProduct,
    updateProduct
};