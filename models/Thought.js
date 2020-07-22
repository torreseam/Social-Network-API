const { Schema, model, Types } = require('mongoose');
const moment = require('moment');


//reactions
const ReactionSchema = new Schema({
    // set custom id to avoid confusion with parent comment _id
    reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId
    },
    reactionBody: {
        type: String,
        required: true,
        maxlength: 280,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a')
    }
},
    {
        toJSON: {
            getters: true
        }
    });


//thoughts
const ThoughtSchema = new Schema({
    thoughtText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280
    },
    username: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (createdAtVal) => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a')
    },
    reactions: [ReactionSchema]
},
    {
        toJSON: {
            // virtuals: true,
            getters: true
        },
        id: false
    }
);



ThoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
})

// create  Thought model using the above Schema
const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;