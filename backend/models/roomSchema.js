const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema(
    {
        name: { type: String, trim: true, default: '' },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('room', RoomSchema);