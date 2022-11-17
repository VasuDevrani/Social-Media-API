import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";

const tokens = [];

const registerUser = async (req, res) => {
  try {
    const pre_user = await User.find({ email: req.body.email });
    if (pre_user.length !== 0) {
      res.status(500).json({ message: "User already exist" });
      return;
    }

    let { password, ...rest } = req.body;
    password = bcrypt.hashSync(password, 10);
    let user = await User.create({
      password,
      ...rest,
    });

    const id = user._id.toString();

    const token = generateToken(id);
    tokens.push(token);

    res.status(200).json({
      name: user.name,
      _id: user._id,
      email: user.email,
      profile_image: user.profile_image,
      followings: user.followings,
      followers: user.followers,
      token: token,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const loginWithToken = async (req, res) => {
  try {
    const accessToken = req.body.token;
    if (!tokens.find((token) => token === accessToken)) {
      res
        .status(500)
        .json({ message: "token expired, try login with email and password" });
      return;
    }
    var decoded = jwt.verify(accessToken, process.env.JWTSECRET);

    tokens.splice(tokens.find((token) => token === accessToken), 1);

    const user = await User.findById(decoded.id).select("-password");
    console.log(user);

    if (!user) {
      res
        .status(500)
        .json({ message: "cannot find user with id, try registering" });
      return;
    }

    const newToken = generateToken(user._id.toString());
    tokens.push(newToken);

    res.status(200).json({ ...user._doc, token: newToken });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!password) {
      res.status(400).json({ message: "Provide all details" });
      return;
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ error: "User doesn't exist" });
      return;
    }
    const passCompare = bcrypt.compare(password, user.password);
    if (!passCompare) {
      return res.status(400).json({ error: "Wrong password" });
    }

    const id = user._id.toString();
    const token = generateToken(id);
    tokens.push(token);

    if (user) {
      res.json({
        name: user.name,
        _id: user._id,
        email: user.email,
        profile_image: user.profile_image,
        followings: user.followings,
        followers: user.followers,
        token: token,
      });
    } else {
      res.status(401);
      throw new Error("Invalid Email or Password");
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const userDetails = async (req, res) => {
  try {
    const details = await User.findById(req.user._id);
    res.status(200).json({
      name: details.name,
      followers: details.followers,
      followings: details.followings,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const followUser = async (req, res) => {
  // the user who followed
  const id = req.user._id;

  const followed_user_id = req.params.id;

  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(400).json({ message: "No such User exist, can't update" });
      return;
    }

    if (user.followings.includes(followed_user_id)) {
      res.status(500).json({ message: "user already in following" });
      return;
    }

    const followings = [...user.followings, followed_user_id];
    const details = await User.findByIdAndUpdate(
      id,
      { followings: followings },
      {
        new: true,
      }
    );

    const otherUser = await User.findById(followed_user_id);
    const followers = [...otherUser.followers, id];

    await User.findByIdAndUpdate(
      followed_user_id,
      {
        followers: followers,
      },
      { new: true }
    );
    res.status(200).json({
      name: user.name,
      _id: user._id,
      email: user.email,
      profile_image: user.profile_image,
      followings: user.followings,
      followers: user.followers,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const unfollowUser = async (req, res) => {
  // the user who unFollowed
  const id = req.user._id;

  const unFollowed_user_id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(400).json({ message: "No such User exist, can't update" });
      return;
    }

    if (!user.followings.includes(unFollowed_user_id)) {
      res.status(500).json({ message: "user already out of followings" });
      return;
    }

    const followings = user.followings.splice(
      user.followings.findIndex(unFollowed_user_id),
      1
    );
    await User.findByIdAndUpdate(
      id,
      { followings: followings },
      {
        new: true,
      }
    );

    const otherUser = await User.findById(unFollowed_user_id);
    const followers = otherUser.followers.splice(
      otherUser.followers.findIndex(id),
      1
    );

    await User.findByIdAndUpdate(
      unFollowed_user_id,
      {
        followers: followers,
      },
      { new: true }
    );
    res.status(200).json({
      name: user.name,
      _id: user._id,
      email: user.email,
      profile_image: user.profile_image,
      followings: user.followings,
      followers: user.followers,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const logOut = () => {
  try {
    const token = req.query.token;

    const index = tokens.find(token);
    tokens.splice(index, 1);

    res.status(200);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export {
  registerUser,
  loginWithToken,
  followUser,
  unfollowUser,
  loginUser,
  userDetails,
  logOut
};
