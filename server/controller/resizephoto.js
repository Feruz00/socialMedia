
const sharp = require('sharp');
const catchAsync = require('../utils/catchAsync');

exports.resizeUserPhoto = catchAsync( async (req, res, next) => {
    if (!req.file) next();
    req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`
    await sharp(req.file.buffer).resize(500, 500).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`public/img/users/${req.file.filename}`)   
    next();
 })