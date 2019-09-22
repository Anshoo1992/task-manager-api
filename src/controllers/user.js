const Users = require('../models/user');

class UsersModule {
    constructor() { }

    async createUser(req, res) {
        const user = new Users(req.body);
        try {
            await user.save();
            const token = await user.generateAuthToken();
            return res.status(201).send({ user, token });
        } catch (error) {
            return res.status(500).send('Error occured!!!' + error);
        }
    }

    async loginUser(req, res) {
        try {
            const user = await Users.loginByCredentials(req.body.email, req.body.password);
            const token = await user.generateAuthToken();
            res.status(200).send({ user, token });
        } catch (error) {
            return res.status(400).send('Error occured!!!' + error);
        }
    }

    async getLoggedInUser(req, res) {
        try {
            res.status(200).send(req.user)
        } catch (error) {
            return res.status(400).send('Error occured!!!' + error);
        }

    }

    async logoutUser(req, res) {
        try {
            req.user.tokens = req.user.tokens.filter((token) => {
                return token.token !== req.token;
            });

            await req.user.save();
            res.send();
        } catch (error) {
            return res.status(500).send('Error occured!!!' + error);
        }
    }

    async logoutAllUser(req, res) {
        try {
            req.user.tokens = [];
            await req.user.save();
            res.status(200).send();
        } catch (error) {
            return res.status(500).send('Error occured!!!' + error);
        }
    }

    async getAllUsers(req, res) {
        try {
            const data = await Users.find({});
            return res.status(201).send(data);
        } catch (error) {
            return res.status(500).send('Error occured!!!' + error);
        }
    }

    

    async updateUser(req, res) {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['name', 'email', 'password', 'age'];
        const isValidUpdates = updates.every((item) => allowedUpdates.includes(item));
        if (!isValidUpdates) return res.status(400).send('Invalid update');
        try {
            updates.forEach((update) => {
                req.user[update] = req.body[update];
            });
            await req.user.save();
            return res.status(201).send(req.user);
        } catch (error) {
            return res.status(400).send('Error occured!!!' + error);
        }
    }

    async deleteUser(req, res) {
        try {
            await req.user.remove();
            return res.status(201).send(req.user);
        } catch (error) {
            return res.status(400).send('Error occured!!!' + error);
        }
    }
}

module.exports = new UsersModule();