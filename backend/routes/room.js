const express = require('express');
const router = express.Router();

const roomController = require('../controllers/roomController');

router.post("/create", async (req, res) => {
    return roomController.room.createRoom(req, res);
});

router.get("", async (req, res) => {
    return roomController.room.getRoomById(req, res);
});

router.get("/get/all", async (req, res) => {
    return roomController.room.getMessages(req, res);
});

module.exports = router;