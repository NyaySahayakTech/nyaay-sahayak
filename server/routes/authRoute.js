const express = require("express");
const router = express.Router();

const { signup, login, } = require("../services/authService");

router.post("/signup", async (req, res, next) => {
    try {
        const user = await signup(req.body);

        res.status(201).json({
            success: true,
            user,
        });
    } catch (error) {
        next(error);
    }
});

router.post("/login", async (req, res, next) => {
    try {
        const user = await login(req.body);

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;