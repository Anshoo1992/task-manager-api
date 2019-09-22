const jwt = require('jsonwebtoken');
const User = require('../models/user');
const secretKeyword = 'generatejsonwebtokenforapp';

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer', '').trim();
        const decoded = jwt.verify(token, secretKeyword);
        const user = await User.findOne({ "_id": decoded._id, "tokens.token": token });
        if (!user) throw new Error();
        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(500).send('Error while authorization ' + error);
    }


}

module.exports = auth;