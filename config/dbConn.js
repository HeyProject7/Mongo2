const mongoose = require('mongoose');
const connect = async () => {
    await mongoose.connect(process.env.DATABASE_URI,
        {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
};
module.exports = connect;