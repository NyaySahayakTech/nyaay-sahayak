const express = require("express");
const router = express.Router();

router.get("/history", async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            message: "Get history route reached",
        });
    } catch (error) {
        next(error);
    }
});

router.get("/history/:id", async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            message: "Get history by id route reached",
        });
    } catch (error) {
        next(error);
    }
});

router.delete("/history/:id", async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            message: "Delete history route reached",
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;