const { mongoose } = require('./index.js');
const messageSchema = new mongoose.Schema({
    author: {
        type: mongoose.Types.ObjectId, 
        ref: 'User',
        // required: true
    },
    content: {
        type: String,
        required: true,
    },
    group: {
        type: mongoose.Types.ObjectId,
        ref: 'Group'
    },
    deleteAt: {
        type: Date,
    }
}, {timestamps: true});
const Message = mongoose.model('Message', messageSchema);
module.exports = Message;