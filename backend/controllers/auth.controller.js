import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const {email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.status(200).json({
      user,
      token,
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { email: user.email, id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "12h" }
        );

        res.status(200).json({
            user,
            token,
            success: true,
            message: "User logged in successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};