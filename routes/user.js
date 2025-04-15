const express = require("express");
const userRouter = express.Router();
const { z } = require("zod");
const { userMiddleware } = require("../middlewares/user")
const jwt = require("jsonwebtoken");
const { JWT_SECRET_USER } = require("../config");
const bcrypt = require("bcrypt");
const {UserModel, PurchaseModel, CourseModel} = require("../db");

userRouter.post("/signup", async (req, res) => {
    const requireBody = z.object({
        email: z.string().email(),
        password: z.string(),
        firstName: z.string(),
        lastName: z.string()
    })

    const parseData = requireBody.safeParse(req.body);

    if(!parseData.success){
        res.status(400).json({
            message: "Invalid Input"
        })
        return;
    }

    const {email, password, firstName, lastName} = req.body;

    try{
        const hashedPassword = await bcrypt.hash(password, 5);

        await UserModel.insertOne({
            email: email,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName
        });

        res.status(200).json({
            message: "You are signup successfully"
        })
    }
    catch{
        res.status(400).json({
            message: "User already exist with same email"
        })
    }
});

userRouter.post("/signin", async (req, res) => {
    try{
        const {email, password} = req.body;

        const user = await UserModel.findOne({
            email: email
        });

        const passwordMatch = await bcrypt.compare(password, user.password);

        if(user && passwordMatch){
            const token = jwt.sign({
                id: user._id.toString()
            }, JWT_SECRET_USER)

            res.json({
                message: "Your are signin",
                token: token
            })
        }
        else{
            res.status(400).send({
                message: "Incorrect credentials"
            })
        }
    }
    catch{
        res.status(400).send({
            message: "You first need signup"
        })
    }
});

userRouter.get("/purchases", userMiddleware, async (req, res) => {
    const userId = req.userId;

    const purchases = await PurchaseModel.find({
        userId: userId
    })

    const courseData = await CourseModel.find({
        _id: {$in: purchases.map(x => x.courseId)}
    })

    res.json({
        courseData
    });
});

module.exports = userRouter;