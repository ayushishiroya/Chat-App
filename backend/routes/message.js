const express = require('express');
const router = express.Router();

const messageController = require('../controllers/messageController');

router.post("/create", async (req, res) => {
    return messageController.message.createMessage(req, res);
});

router.post('/upload', async (req, res) => {
    return messageController.message.uploadFile(req, res);
});


router.get("", async (req, res) => {
    return messageController.message.getMessages(req, res);
});

router.get("/get/by-room", async (req, res) => {
    return messageController.message.getMessagesByRoom(req, res);
});

module.exports = router;