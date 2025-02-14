const ROOM = require('../models/roomSchema');
const { ObjectId } = require('mongodb');

exports.room = {
    createRoom: async (req, res) => {
        try {
            const { name } = req.body;

            const isCreated = await ROOM.create({ name });

            return !isCreated
                ? res.json({ isSuccess: false, status: 400, message: "Something went wrong!" })
                : res.json({ isSuccess: true, status: 200, message: "Room created successfully!", roomId: isCreated._id });

        } catch (error) {
            return res.json({ isSuccess: false, status: 500, message: error.message });
        }
    },
    getRoomById: async (req, res) => {
        try {
            const { id } = req.query;

            const pipeline = [
                {
                    $match: {
                        _id: new ObjectId(id)
                    }
                }
            ]

            const room = await ROOM.aggregate(pipeline);

            return !room
                ? res.json({ isSuccess: false, status: 400, message: "Something went wrong!" })
                : res.json({ isSuccess: true, status: 200, record: room?.length > 0 ? room[0] : {} });

        } catch (error) {
            return res.json({ isSuccess: false, status: 500, message: error.message });
        }
    },
    getMessages: async (req, res) => {
        try {
            const rooms = await ROOM.find({});

            return !rooms
                ? res.json({ isSuccess: false, status: 400, message: "Something went wrong!" })
                : res.json({ isSuccess: true, status: 200, records: rooms });
        } catch (error) {
            return res.json({ isSuccess: false, status: 500, message: error.message });
        }
    }
}