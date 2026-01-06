// src/controller/auth.controller.js
import User from "../models/auth.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.util.js";

// ========================== SIGN UP ==========================
export const signUp = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role)
            return res.status(400).json({ message: "All fields are required" });

        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
        });

        await newUser.save();

        const token = generateToken(newUser._id);

      res.cookie("token", token, {
    httpOnly: true,
    sameSite: "none",   // Required for cross-origin
    secure: true,        // Required when sameSite is "none"
    maxAge: 7 * 24 * 60 * 60 * 1000,
});

        return res.status(201).json({
            message: "User created successfully",
            user: newUser,
        });

    } catch (error) {
        console.error("SIGNUP ERROR:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

// ========================== SIGN IN ==========================
export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ message: "Email and password required" });

        const existingUser = await User.findOne({ email });
        if (!existingUser)
            return res.status(400).json({ message: "Invalid credentials" });

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid)
            return res.status(400).json({ message: "Invalid credentials" });

        const token = generateToken(existingUser._id);

       res.cookie("token", token, {
    httpOnly: true,
    sameSite: "none",   // Required for cross-origin
    secure: true,        // Required when sameSite is "none"
    maxAge: 7 * 24 * 60 * 60 * 1000,
});

        return res.status(200).json({
            message: "Signed in successfully",
            user: existingUser,
        });

    } catch (error) {
        console.error("SIGNIN ERROR:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

// ========================== SIGN OUT ==========================
export const signOut = (req, res) => {
    try {
     res.cookie("token", token, {
    httpOnly: true,
    sameSite: "none",   // Required for cross-origin
    secure: true,        // Required when sameSite is "none"
    maxAge: 7 * 24 * 60 * 60 * 1000,
});


        return res.status(200).json({ message: "Signed out successfully" });

    } catch (error) {
        console.error("SIGNOUT ERROR:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

// ========================== CHECK AUTH ==========================
export const checkAuth = (req, res) => {
    try {
        return res.status(200).json({
            message: "Authenticated",
            user: req.user,
        });
    } catch (error) {
        console.error("CHECKAUTH ERROR:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

