import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    hashedPassword: {
      type: String,
      required: true,
      unique: false,
      trim: false,
      minlength: 12,
      maxlength: 256,
    },
    friends: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
