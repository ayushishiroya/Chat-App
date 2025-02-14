const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: { type: String, trim: true, default: '' },
        email: { type: String, trim: true, default: '' },
        phone: { type: String, trim: true, default: '' },
        username: { type: String, trim: true, default: '' },
        password: { type: String, trim: true, default: '' }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("user", userSchema);