const USER = require('../models/userSchema');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

const JWT_SECRET = process.env.JWT_SECRET;

exports.user = {
    signUp: async (req, res) => {
        try {
            const { name, email, phone, username, password } = req.body;

            const user = await USER.findOne({ username });
            if (user) return res.json({ isSuccess: false, status: 400, message: "User already exists!" });

            const userDetails = { name, email, phone, username, password };
            const isCreated = await USER.create(userDetails);

            return !isCreated
                ? res.json({ isSuccess: false, status: 400, message: "Something went wrong!" })
                : res.json({ isSuccess: true, status: 200, message: "User created successfully!" });

        } catch (error) {
            return res.json({ isSuccess: false, status: 500, message: error.message });
        }
    },
    signIn: async (req, res) => {
        try {
            const { username, password } = req.body;

            const user = await USER.findOne({ username });
            if (!user) return res.json({ isSuccess: false, status: 400, message: "User not found!" });

            if (user.username != username || user.password !== password) return res.json({ isSuccess: false, status: 400, message: " Invalid Username or password!" });

            const token = jwt.sign({ user }, JWT_SECRET, { expiresIn: '24h' });

            return !token
                ? res.json({ isSuccess: false, status: 400, message: "Something went wrong!" })
                : res.json({ isSuccess: true, status: 200, accesstoken: token });

        } catch (error) {
            return res.json({ isSuccess: false, status: 500, message: error.message });
        }
    },
    listUsers: async (req, res) => {
        try {
            const { id } = req.query;

            const pipeline = [
                {
                    $match: {
                        _id: { $ne: new ObjectId(id) }
                    }
                }
            ]

            const users = await USER.aggregate(pipeline);

            return !users
                ? res.json({ isSuccess: false, status: 400, message: "Something went wrong!" })
                : res.json({ isSuccess: true, status: 200, records: users });

        } catch (error) {
            return res.json({ isSuccess: false, status: 500, message: error.message });
        }
    },
    getUserById: async (req, res) => {
        try {
            const { id } = req.query;

            const pipeline = [
                {
                    $match: {
                        _id: new ObjectId(id)
                    }
                }
            ]

            const users = await USER.aggregate(pipeline);

            return !users
                ? res.json({ isSuccess: false, status: 400, message: "Something went wrong!" })
                : res.json({ isSuccess: true, status: 200, record: users?.length > 0 ? users[0] : {} });

        } catch (error) {
            return res.json({ isSuccess: false, status: 500, message: error.message });
        }
    }
}