//router.get('/users/:id',authMiddleWare, UsersModule.getUserById);
//router.patch('/users/:id', UsersModule.getUserByIdAndUpdate);
//router.patch('/users/:id',authMiddleWare, UsersModule.updateUserById);

class ExtraFunction{
    async getUserById(req, res) {

        try {
            const user = await Users.findById(req.params.id);
            if (!user) res.status(404).send('Not Found');
            return res.status(201).send(user);
        } catch (error) {
            return res.status(500).send('Error occured!!!' + error);
        }

    }

    async getUserByIdAndUpdate(req, res) {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['name', 'email', 'password', 'age'];
        const isValidUpdates = updates.every((item) => allowedUpdates.includes(item));
        if (!isValidUpdates) return res.status(400).send('Invalid update');
        try {
            const user = await Users.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
            if (!user) res.status(404).send('Not Found');
            return res.status(201).send(user);
        } catch (error) {
            return res.status(400).send('Error occured!!!' + error);
        }
    }

    async updateUserById(req, res) {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['name', 'email', 'password', 'age'];
        const isValidUpdates = updates.every((item) => allowedUpdates.includes(item));
        if (!isValidUpdates) return res.status(400).send('Invalid update');
        try {
            const user = await Users.findById(req.params.id);
            updates.forEach((update) => {
                user[update] = req.body[update];
            });
            await user.save();
            if (!user) res.status(404).send('Not Found');
            return res.status(201).send(user);
        } catch (error) {
            return res.status(400).send('Error occured!!!' + error);
        }
    }

    async deleteUserById(req, res) {
        try {
            const user = await Users.findByIdAndDelete(req.params.id);
            if (!user) return res.status(404).send('Not Found');
            return res.status(201).send(user);
        } catch (error) {
            return res.status(400).send('Error occured!!!' + error);
        }
    }
}