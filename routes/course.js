const express = require("express");
const courseRouter = express.Router();
const { z } = require("zod");
const { userMiddleware } = require("../middlewares/user")
const {CourseModel, PurchaseModel} = require("../db");

courseRouter.post("/purchase", userMiddleware, async(req, res) => {
    const userId = req.userId;
    const creatorId = req.body.creatorId;

    await PurchaseModel.insertOne({
        userId: userId,
        creatorId: creatorId
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
})