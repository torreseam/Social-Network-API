const { Thought, User } = require('../models');

/// can use for thought
const thoughtController = {
    //addThought to user
    addThought({ params, body }, res) {
        console.log("POST:", params)
        // console.log(body);
        Thought.create(body)
            .then(({ _id }) => {
                console.log(_id);
                return User.findOneAndUpdate(
                    { _id: params.userId },
                    { $push: { thoughts: _id }},
                    { new: true, runValidators: true }
                );
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id.'});
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },

    //get all Thoughts
    getAllThought(req, res) {
        Thought.find({})
            // .populate({
            //     path: 'thoughts',
            //     select: '-__v',
            // })
            // .select('-__v')
            // .sort({ _id: -1 })
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            })
    },

    //get one Thought by ID
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.thoughtId })
            // .populate({
            //     path: 'thoughts',
            // select: '-__v'
            // })
            .select('-__v')
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with this id!' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.status(500).json(err));
    },

    //update Thought
    updateThought({ params, body }, res) {
        console.log(params);
        Thought.findOneAndUpdate({ _id: params.thoughtId }, body, { new: true, runValidators: true })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with this id!' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.status(400).json(err));
    },

    //Delete Thought
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.thoughtId })
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No user found with this id.' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch((err) => res.status(400).json(err));
    },

    //add Reaction to user via thought
    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { new: true, runValidators: true }
        )
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with this id' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    //remove reaction 
    // deleteReaction({ params }, res) {
    //     Thought.findByIdAndUpdate(
    //         { _id: params.thoughtId },
    //         { $pull: { reaction: { reactionId: params.reactionId } } },
    //         { new: true }
            
            // { new: true, runValidators: true }

        // )

            // .populate({
            //     path: 'reactions',
            //     select: '-__v'
            // })
            // .select('-__v')

            // .then(dbUserData => res.json(dbUserData))

            //     if (!dbThoughtData) {
            //         res.status(404).json({ message: 'No thought found with this id!' });
            //         return;
            //     }
            //     res.json(dbThoughtData);
            // })


    //         .catch(err => res.json(err));
    // },
    deleteReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true }
        )
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.json(err));
    },

};

module.exports = thoughtController;