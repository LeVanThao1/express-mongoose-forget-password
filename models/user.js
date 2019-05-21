const { mongoose } = require('./index.js')
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        min: 3,
        max: 30,
        unique: true,
        required: true
    },
    password: {
        type: String,
        min: 6,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    verifyCode: {
        type: String
    },
    verifyCodeExpiredAt: {
        type: Date
    } 
});
const User = mongoose.model('User', userSchema);
module.exports = User;