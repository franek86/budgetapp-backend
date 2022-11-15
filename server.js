const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv").config();
const errorHander = require("./middleware/errorHandler")
const port = process.env.PORT || 5000;
const connectDB = require("./database/db");
const cookieParser = require('cookie-parser')

app.use(cors())

//call connect to databsae
connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



const categoryRoute = require("./routes/category");
const transactionRoute = require("./routes/transaction");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");




app.use("/api/category", categoryRoute);
app.use("/api/transaction", transactionRoute);
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use(errorHander);
app.use(cookieParser);


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})