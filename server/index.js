const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ExpressError = require("./utils/expressError.js");
const session = require("express-session");
const User = require("./models/User.js");
const flash = require("express-flash");
const cors = require('cors');
const { body, validationResult } = require('express-validator');

if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

let authRouter = require("./routes/authRoute.js")
let bookRouter = require("./routes/bookRoute.js")
let transactionRouter = require("./routes/transactionRoute.js")
let userRouter = require("./routes/userRoute.js")

const port = process.env.PORT || 3000;
const MONGO_URL = "mongodb://127.0.0.1:27017/book-marketplace";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(MONGO_URL)
    .then(() => {
        console.log("MongoDB connection open");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 4 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOptions));
app.use(cors({ origin: 'http://localhost:5173' }));

app.use("/auth", authRouter);
app.use("/book", bookRouter);
app.use("/transactions", transactionRouter);
app.use("/users", userRouter);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something Went Wrong" } = err;
    res.status(statusCode).render("error.ejs", { err });
});

app.listen(port, () => {
    console.log(`App running on port: ${port}`);
});
