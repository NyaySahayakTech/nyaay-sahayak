const History = require("../models/History");

async function getHistory(userId) {
    return await History.find({
        userId,
    }).sort({
        createdAt: -1,
    });
}

async function getHistoryById(
    historyId
) {
    return await History.findById(
        historyId
    );
}

async function deleteHistory(
    historyId
) {
    return await History.findByIdAndDelete(
        historyId
    );
}

module.exports = {
    getHistory,
    getHistoryById,
    deleteHistory,
};