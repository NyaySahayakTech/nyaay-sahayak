const bcrypt = require("bcryptjs");
const User = require("../models/User");

function normalizeEmail(email) {
    return String(email || "").trim().toLowerCase();
}

function toPublicUser(user) {
    return {
        id: String(user._id),
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl || "",
        authProvider: user.authProvider || "local",
        createdAt:
            user.createdAt instanceof Date
                ? user.createdAt.toISOString()
                : user.createdAt,
    };
}
async function signup({ name, email, password }) {
    const safeName = String(name || "").trim();
    const safeEmail = normalizeEmail(email);
    const safePassword = String(password || "");

    if (!safeName || safeName.length < 2) {
        throw new Error("Name must be at least 2 characters long.");
    }

    if (!safeEmail || !safeEmail.includes("@")) {
        throw new Error("Please provide a valid email address.");
    }

    if (safePassword.length < 6) {
        throw new Error("Password must be at least 6 characters long.");
    }

    const existingUser = await User.findOne({ email: safeEmail }).lean();

    if (existingUser) {
        const error = new Error("An account with this email already exists.");
        error.statusCode = 409;
        throw error;
    }

    const passwordHash = await bcrypt.hash(safePassword, 10);

    const user = await User.create({
        name: safeName,
        email: safeEmail,
        passwordHash,
        authProvider: "local",
    });

    return toPublicUser(user);
}

module.exports = {
    signup,
};