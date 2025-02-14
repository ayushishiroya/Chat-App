const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
    {
        text: { type: String, trim: true, default: '' },
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'user', default: null },
        receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'user', default: null },
        file: { type: String, trim: true, default: '' },
        room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', default: null },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('message', messageSchema);