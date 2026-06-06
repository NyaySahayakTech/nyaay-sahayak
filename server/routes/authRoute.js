const express = require("express");
const router = express.Router();

const { signup } = require("../services/authService");

router.post("/signup", async (req, res) => {
    try {
        const user = await signup(req.body);

        res.status(201).json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
        });
    }
});

module.exports = router;