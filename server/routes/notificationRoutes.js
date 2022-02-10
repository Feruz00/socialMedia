const router = require('express').Router();
const User = require('../models/User')
const Post = require('../models/Post')
const Follow = require('../models/Follow')
const uuid = require('uuid').v4;
const Notifications = require('../models/Notifications');
const { logged } = require('../middleware/authMiddleware');

router.put('/', logged, async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user._id, {$set: { unreadNotifications: false} } )
        return res.json()
    } catch (error) {
        return res.status(500).json(error)
    }
});

router.get('/', logged, async (req, res) => {
    try {
        const notifi = await Notifications.findOne({user: req.user._id}).populate('notifications.user').populate('notifications.post').populate('notifications.ansUser')
        return res.json(notifi)
    } catch (error) {
        return res.status(500).json(error)
    }
} )


module.exports = router