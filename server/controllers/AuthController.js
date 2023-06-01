import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register new user
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  req.body.password = await bcrypt.hash(password, 10);
  const newUser = new UserModel(req.body);
  try {
    // addition new
    const oldUser = await UserModel.findOne({ username, email });

    if (oldUser) return res.status(400).json({ message: "User already exists" });

    // changed
    const user = await newUser.save();
    const token = jwt.sign(
      { username: user.username, id: user._id },
      "hello",
      { expiresIn: "365d" }
    );
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User

// Changed
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username });

    if (user) {
      const validity = await bcrypt.compare(password, user.password);

      if (!validity) {
        res.status(400).json("wrong password");
      } else {
        const token = jwt.sign(
          { username: user.username, id: user._id },
          "hello",
          { expiresIn: "365d" }
        );
        res.status(200).json({ user, token });
      }
    } else {
      res.status(404).json("User not found");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
