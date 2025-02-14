const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.post("/sign-up", async (req, res) => {
    return userController.user.signUp(req, res);
});

router.post("/sign-in", async (req, res) => {
    return userController.user.signIn(req, res);
});

router.get("/get/all", async (req, res) => {
    return userController.user.listUsers(req, res);
});

router.get("", async (req, res) => {
    return userController.user.getUserById(req, res);
});

module.exports = router;