const { Schema, model } = require('mongoose');
const moment = require('moment');

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        // trim: true,
        match: [/^([a-z0-9_\.-]+)@([a-z\.-]+)\.([a-z\.]{2,6})$/, 'Please enter a valid email address!']
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (createdAtVal) => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a')
    },
    thoughts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Thought'
        }
    ],
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
},
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
);


//get total count of friends on retrieval
UserSchema.virtual('friendCount').get(function () {
    return this.friends.length;
});

//get total count of thoughts on retrieval
// UserSchema.virtual('thoughtCount').get(function () {
//     return this.thoughts.reduce((total, thought) => total + thought.reactions.length + 1, 0);
// });


//create the User model using UserSchema 
const User = model('User', UserSchema);

//export the User model
module.exports = User;