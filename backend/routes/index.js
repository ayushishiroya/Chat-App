const express = require('express');
const router = express.Router();

const user = require('../routes/user');
const message = require('../routes/message');
const room = require('../routes/room');

router.use('/user', user);
router.use('/message', message);
router.use('/room', room);

module.exports = router;