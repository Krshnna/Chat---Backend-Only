const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

require("dotenv").config();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

//route
const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chat");
const messageRoutes = require("./routes/message");
const { notFound } = require("./middlewares/errorHandler");


//importing routes
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);


// middlewares
app.use(notFound);



module.exports = app;