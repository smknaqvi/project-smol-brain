import { model, Schema, Document } from 'mongoose';

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
    usernameLower: {
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
    },
    friends: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

export interface UserDocument extends Document {
  username: string;
  hashedPassword: string;
  friends: Array<string>;
}

export default model<UserDocument>('User', userSchema);
