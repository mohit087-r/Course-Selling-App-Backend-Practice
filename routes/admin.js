const express = require("express");
const adminRouter = express.Router();
const { z } = require("zod");
const { adminMiddleware } = require("../middlewares/admin")
const { JWT_SECRET_ADMIN } = require("../config");
const bcrypt = require("bcrypt");
const {AdminModel, CourseModel} = require("../db");

adminRouter.post("/signup", async (req, res) => {
    const requireBody = z.object({
        email: z.string().email(),
        password: z.string(),
        firstName: z.string(),
        lastName: z.string()
    })

    const parseData = requireBody.safeParse(req.body);

    if(!parseData.success){
        res.json({
            message: "Invalid Input"
        })
        return;
    }

    const {email, password, firstName, lastName} = req.body;

    try{
        const hashedPassword = await bcrypt.hash(password, 10);

        await AdminModel.insertOne({
            email: email,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName
        })

        res.json({
            message: "You are signup successfully"
        })
    }
    catch {
        res.json({
            message: "Admin already with this email"
        })
    }
});

adminRouter.post("/singin", async (req, res) => {
    try{
        const { email, password } = req.body;

        const admin = await AdminModel.findOne({
            email: email
        })

        const adminMatch = await bcrypt.compare(password, admin.password);

        if(admin && adminMatch){
            const token = jwt.sign({
                id: admin._id.toString()
            }, JWT_SECRET_ADMIN)

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
            message: "You first need singup"
        })
    }
});

adminRouter.post("/course", adminMiddleware, async (req, res) => {
    const creatorId = req.creatorId;
    const {title, description, imageUrl, price} = req.body;

    const course = await CourseModel.insertOne({
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price,
        creatorId: creatorId
    })

    res.json({
        message: "course created",
        courseId: course._id
    })
});

adminRouter.put("/course",  adminMiddleware, async (req, res) => {
    const creatorId = req.creatorId;

    const { title, description, imageUrl, price, courseId} = req.body;

    try{
        await CourseModel.findOne({
            creatorId: creatorId,
            _id: courseId
        },{
            title: title,
            description: description,
            imageUrl: imageUrl,
            price: price,
            creatorId: creatorId
        })

        res.json({
            message: "course updated"
        })
    }
    catch {
        res.json({
            message: "You can not access this course"
        })
    }
});

adminRouter.get("/courses", adminMiddleware, async (req, res) => {
    const creatorId = req.creatorId;

    const courses = await CourseModel.find({
        creatorId: creatorId
    });

    if(courses.length == 0){
        res.json({
            message: "You don't have any courses"
        })
        return;
    }

    res.json({
        courses
    })
});


module.exports = adminRouter;