import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required:true
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
  }, 
  { timestamps: true ,}
);

//user and users are not allowed, mongoose want capitalised and sigular name for collection.
const User  = mongoose.model("User", userSchema)

export default User