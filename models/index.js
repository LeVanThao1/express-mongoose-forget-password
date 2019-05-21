//destructuring  pha vo
const mongoose = require('mongoose');

module.exports = {
    connectDB: () => {
        return mongoose.connect('mongodb://localhost/hello-server', { useNewUrlParser: true });
    },
    mongoose
}