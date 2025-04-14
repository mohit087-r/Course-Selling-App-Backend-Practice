const express = require("express");
const mongoose = require("mongoose");
const app = express();

main();
async function main() {
    await mongoose.connection()
}
app.listen(3000);