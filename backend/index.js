const express = require("express");
const mongoose = require("mongoose");
const router = require("./Route/userRouter"); //insert route

const app = express();
const cors = require("cors");

const PORT = 5000;
 
//Middleware
app.use(express.json());
app.use(cors());
app.use("/users",router);
app.use("/files",express.static("files"));

mongoose.connect("mongodb+srv://vidushika:BfgwUDnfQIe71WHG@cluster0.hxe46hj.mongodb.net/")
.then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(5000, () => {
        console.log("🚀 Server is running on port 5000");
    });
})
.catch((err) => console.log("❌ MongoDB Connection Error:", err));