const express = require("express");
const courseRouter = express.Router();
const { userMiddleware } = require("../middlewares/user")
const {CourseModel, PurchaseModel} = require("../db");

courseRouter.post("/purchase", userMiddleware, async(req, res) => {
    const userId = req.userId;
    const courseId = req.body.courseId;

    await PurchaseModel.insertOne({
        userId: userId,
        courseId: courseId
    });

    res.json({
        message: "Purchased successfull"
    })
});


courseRouter.get("/preview", async(req, res) => {

    const courses = await CourseModel.find({});

    res.json({
        courses
    })
});

module.exports = courseRouter;