const router = require('express').Router();
const { 
    getAllThought,
    getThoughtById,
    addThought,
    updateThought,
    deleteThought,
    addReaction,
    deleteReaction
} = require('../../controllers/thought-controller');

// /api/thoughts get all thoughts
router
    .route('/')
    .get(getAllThought)

//Post one thought
router    //host/api/thought/thought
    .route('/:userId')
    .post(addThought)

//Thought Get one, Put, Delete
router
    .route('/:thoughtId')
    .get(getThoughtById)
    .put(updateThought)
    .delete(deleteThought)

//Reactions /api/thoughts/:thoughtId/reactions
router
    .route('/:thoughtId/reaction')
    .put(addReaction)
    .delete(deleteReaction)



module.exports = router;
