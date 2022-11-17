import Comments from "../models/CommentModel.js";
import Post from "../models/PostModel.js";

const createComment = async (req, res) => {
    const userId = req.user._id;
    const postId = req.params.id;

  try {
    const { comment } = req.body;

    const data = await Comments.create({
      post: postId,
      comment: comment,
      sender: userId
    });

    let postItem = await Post.findById(postId);
    var preData = postItem.comments;

    const newPost = await Post.findByIdAndUpdate(
      postItem?._id,
      {
        comments: [...preData, data._id.toString()],
      },
      { new: true }
    );

    res.status(200).json(data._id);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

export { createComment };