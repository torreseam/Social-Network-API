const { User } = require('../models');
const mongoose = require('mongoose');

const userController = {
    // get all pizzas
    getAllUsers(req, res) {
        User.find({})
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .select('-__v')
            .sort({ _id: -1 })
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    },
    // get one pizza by id
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .select('-__v')
            .then(dbUserData => {
                // If no pizza is found, send 404
                if (!dbUserData) {
                    res.status(404).json({ message: 'No User found with this id!' });
                    return;
                }
                res.json(dbUserData)
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    //create User
    createUser({ body }, res) {
        console.log(body);
        User.create(body)
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.status(400).json(err));
    },

    //update User by id
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No User found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    },

    //delete User 
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    },

    //add a Friend 
    addFriend({ params }, res) {
        // console.log(params);
        User.updateMany(
            { _id: mongoose.Types.ObjectId(params.id) },
            { $push: { friends: mongoose.Types.ObjectId(params.friendId) } },
            { new: true, runValidators: true }
        )
            .populate({
                path: 'friends',
                select: '_id'
            })
            .select('-__v')
            .then(dbUserData => {
                console.log(dbUserData);
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!' })
                    return;
                }
                User.findOne({ _id: params.id })
                    .then(user => {
                        res.json(user);
                    })
            })
            .catch(err => {
                res.status(400).json(err)
            })
    },

    //remove a Friend 
    removeFriend({ params }, res) {
        User.findByIdAndUpdate(
            { _id: params.id },
            { $pull: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
            .populate({
                path: 'friends',
                select: '_id'
            })
            .select('-__v')
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!' })
                    return;
                }
                res.json(dbUserData)
            })
            .catch(err => {
                res.status(400).json(err)
            })
    }

}


module.exports = userController;
