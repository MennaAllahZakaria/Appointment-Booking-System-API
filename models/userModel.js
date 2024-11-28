const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: (value) => {
            const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
            return emailRegex.test(value);
        },
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false,
    },
    passwordChangeAt: String,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    phoneNumber: {
        type: String,
        required: [true,'Phone number is required'],
        unique: true,
        validate: (value) => {
            const egyptPhoneRegex = /^(\+20|0020|0)?(10|11|12|15)\d{8}$/;
            return egyptPhoneRegex.test(value);
        },
        message: (props) => `${props.value} is not a valid Egyptian phone number!`,
    },
    role: {
        type: String,
        enum: ['user','provider', 'admin'],
        default: 'user',
    },
    active:{
        type: Boolean,
        default: true,
    },
    //for provider
    specialty: {
        type: String,
        required: function () {
            return this.role === 'provider';
        },
    },//(e.g., "Cardiologist", "Dentist").
    availability: [
        {
            day: {
                type: String,
                enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                required: true,
                required: function () {
                    return this.role === 'provider'; // Validate only for providers
                },
            }, // e.g., "Monday"
            times: [String], // e.g., ["10:00 AM - 11:00 AM", "3:00 PM - 4:00 PM"]
        },
    ],
      // Shared field for appointments
    appointments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Appointment',
        },
    ],
    
},{ timestamps: true,});

//@ dec remove "password" &"__v" from the output
userSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        delete ret.password; // remove "password" from the output
        delete ret.__v;  // remove "__v" from the output
        return ret;
    }
});


module.exports = mongoose.model('User', userSchema);


