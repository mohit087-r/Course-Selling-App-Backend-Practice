const express = require("express");
const userRouter = express.Router();
const { z } = require("zod");
const { userMiddleware } = require("../middlewares/user")
const { JWT_SECRET_USER } = require("../config");
const bcrypt = require("bcrypt");
const {UserModel, PurchaseModel} = require("../db");

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

userRouter.post("/signin",async (req, res) => {
    try{
        const {email, password} = req.body;

        const user = await UserModel.findOne({
            email: email
        })

        const userMatch = await bcrypt.compare(password, user.password)

        if(user && userMatch){
            const token = jwt.sing({
                id: user._id.toString()
            }, JWT_SECRET_USER)

            res.json({
                message: "You are signin successfully",
                token: token
            })
        }
        else{
            res.json({
                message: "Incorrect credentials"
            })
        }
    }
    catch{
        res.json({
            message: "You first need to signup"
        })
    }
});

userRouter.post("/purchases", userMiddleware, async (req, res) => {
    const userId = req.userId;

    const purchases = await PurchaseModel.find({
        userId: userId
    })

    const courseData = await PurchaseModel.find({
        _id: {$in: purchases.map(x => x.courseId)}
    })

    res.json({
        courseData
    });
});

module.exports = userRouter;