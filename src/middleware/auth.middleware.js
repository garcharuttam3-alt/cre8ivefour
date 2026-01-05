// src/middleware/auth.middleware.js
import jwt from "jsonwebtoken";
import User from "../models/auth.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token)
            return res.status(401).json({ message: "Unauthorized: No token" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const userId = decoded.userId;
        if (!userId)
            return res.status(401).json({ message: "Unauthorized: Invalid token" });

        const user = await User.findById(userId).select("-password");
        if (!user)
            return res.status(401).json({ message: "Unauthorized: User not found" });

        req.user = user;
        next();

    } catch (err) {
        console.error("PROTECT ROUTE ERROR:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
