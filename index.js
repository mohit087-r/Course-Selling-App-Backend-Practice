require('dotenv').config(); 
const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());

main();
async function main() {
    await mongoose.connection()
}
app.listen(3000);