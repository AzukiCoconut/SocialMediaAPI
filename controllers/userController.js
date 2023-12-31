const { User, Thought } = require('../models');

module.exports = {
    // get all the users
    async getUser(req, res) {
        try{
            const users = await User.find();

            res.json(users);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },

    // Get one user by ID
    async getSingleUser(req, res) {
        try {
            const user = await User.findOne({_id: req.params.userId}).select('-__v');

            if (!user) {
                return res.status(404).json({message: 'No student with that ID'})
            }
            res.json(user);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }, 

    // Create a user
    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Update a user by ID
    async updateUser(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: req.body },
                { runValidators: true, new: true }
            );

            if (!user) {
                res.status(404).json({ message: 'No user with that ID' });
            }

            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Delete a user by ID
    async deleteUser(req, res) {
        try {
            const user = await User.findOneAndDelete({ _id: req.params.userId });

            if (!user) {
                return res.status(404).json({ message: 'No user with that ID'});
            }
            await Thought.deleteMany({ _id: { $in: user.thoughts } });
            res.json({ message: 'User and associated thoughts deleted!' });
        } catch (err) {
            res.status(500).json(err);
        }
    },
    
    // Add a userId to the friend array of the user model.  Has two parameters userID and userID of the freind to add (friendID)
    async createFriend(req, res) {
        try {
            const friend = await User.findOneAndUpdate(
               {_id: req.params.userId },
               { $push: {friends: req.params.friendId}},
               { new: true}
            );

            if (!friend) {
                return res.status(404).json({ message: 'No user with this ID' });
            }

            res.json(friend);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Removes a friend from the friend array of the user model.  Has two parameters userID and UserID of the friend to remove (friendId)
    async removeFriend(req, res) {
        try {
            const friend = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendId }},
                { new: true }
            );

            if (!friend) {
                return res.status(404).json({ message: 'No user with this ID'});
            }

            res.json(friend);
        } catch(err) {
            res.status(500).json(err)
        }
    },
};