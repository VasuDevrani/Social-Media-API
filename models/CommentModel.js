import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  content: { type: String },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" }
});

const Comments = mongoose.model('Comments', CommentSchema);
export default Comments;