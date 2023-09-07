const express = require("express");
const app = require("./app");
const { connectDB } = require("./database/db");

connectDB();

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});




