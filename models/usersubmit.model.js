const mongoose = require('mongoose');

const UsersubmitSchema= mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Plese enter your name"],
        },
email: {
    type: String,
    required: true
}

    }
);

const Usersubmit = mongoose.model('Usersubmit', UsersubmitSchema);
module.exports = Usersubmit;
