import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const UserSchema = new Schema(
  {
    KEY_ID: {
      type: String,
      required: true,
    },
    KEY_SECRET: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    profilepic: {
      type: String,
      default: "",
    },
    coverpic: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

const User = models.User || model("User", UserSchema);

export default User;
