const MESSAGE = require('../models/messageSchema');
const { ObjectId } = require('mongodb');

exports.message = {
    createMessage: async (req, res) => {
        try {
            const { sender, receiver, text, room } = req.body;

            const isCreated = await MESSAGE.create({ sender, receiver, text, room });

            return !isCreated
                ? res.json({ isSuccess: false, status: 400, message: "Something went wrong!" })
                : res.json({ isSuccess: true, status: 200, message: "Message created successfully!", record: isCreated });

        } catch (error) {
            return res.json({ isSuccess: false, status: 500, message: error.message });
        }
    },
    uploadFile: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ isSuccess: false, message: "No file uploaded" });
            }

            const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;

            return res.json({ isSuccess: true, fileUrl });
        } catch (error) {
            return res.status(500).json({ isSuccess: false, message: error.message });
        }
    },
    getMessages: async (req, res) => {
        try {
            const { sender, receiver } = req.query;

            const messages = await MESSAGE.find({
                $or: [
                    { sender: sender, receiver: receiver },
                    { sender: receiver, receiver: sender }
                ]
            })

            return !messages
                ? res.json({ isSuccess: false, status: 400, message: "Something went wrong!" })
                : res.json({ isSuccess: true, status: 200, records: messages });
        } catch (error) {
            return res.json({ isSuccess: false, status: 500, message: error.message });
        }
    },
    getMessagesByRoom: async (req, res) => {
        try {
            const { room } = req.query;

            const pipeline = [
                { $match: { room: new ObjectId(room) } },
                {
                    $lookup: {
                        from: "users",
                        localField: "sender",
                        foreignField: "_id",
                        pipeline: [
                            {
                                $project: {
                                    name: 1
                                }
                            }
                        ],
                        as: "user"
                    }
                },
                { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
                {
                    $set: {
                        user: "$user.name"
                    }
                }
            ]

            const messages = await MESSAGE.aggregate(pipeline);

            return !messages
                ? res.json({ isSuccess: false, status: 400, message: "Something went wrong!" })
                : res.json({ isSuccess: true, status: 200, records: messages });
        } catch (error) {
            return res.json({ isSuccess: false, status: 500, message: error.message });
        }
    }
}