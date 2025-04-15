require('dotenv').config(); 
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");
const courseRouter = require("./routes/course");

app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/course", courseRouter);

main();
async function main() {
    await mongoose.connect(process.env.MODULE_URL);
}

app.listen(3000);