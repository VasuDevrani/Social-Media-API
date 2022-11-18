import Post from "../models/PostModel.js";

const createPost = async (req, res) => {
  const { desc, title } = req.body;

  try {
    const post = await Post.create({
      desc: desc,
      title: title,
      likes: [],
      comments: [],
      user: req.user._id,
    });

    const result = await Post.findById(post._id).populate("user");
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const id = req.params.id;

    const userId = req.user._id;
    const post = await Post.findById(id);

    if (post.user.toString() !== userId.toString()) {
      res
        .status(400)
        .json({ message: "user not authorised for changes in the post" });
      return;
    }
    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: "post successfully deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const likePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id;

  try {
    const post = await Post.findById(postId);

    const likes = [...post.likes, userId];
    await Post.findByIdAndUpdate(postId, { likes: likes });

    res.status(200).send("post successfully liked");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const unlikePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id;

  try {
    const post = await Post.findById(postId);

    const likes = post.likes.filter(
      (items) => items.toString() !== userId.toString()
    );
    await Post.findByIdAndUpdate(postId, { likes: likes });

    res.status(200).send("post successfully unliked");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSinglePost = async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await Post.findById(postId)
      .populate("likes")
      .populate("comments");
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPost = async (req, res) => {
  const userId = req.user._id;

  try {
    const post = await Post.find({ user: userId })
      .populate("likes")
      .populate("comments");

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export {
  createPost,
  deletePost,
  likePost,
  unlikePost,
  getSinglePost,
  getPost,
};
