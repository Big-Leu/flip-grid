import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 20
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 20
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true, // Ensures uniqueness and creates an index
        lowercase: true,
        index: true // Creates an additional index for performance optimization
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true, // Ensures uniqueness and creates an index
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String
    }
}, {
    versionKey: false,
    timestamps: true
});

// Create an index for the `username` field
userSchema.index({ username: 1 });

const User = mongoose.model('User', userSchema);

export default User;
