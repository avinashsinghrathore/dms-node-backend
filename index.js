const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const userRouter = require("./src/routes/user.routes");
const productRouter = require("./src/routes/product.routes");
const dotenv = require("dotenv").config();

// port
const PORT = 8080;

// middleware
app.use(cors());
app.use(express.json());
app.use("/api/users", userRouter.router);
app.use("/api/product", productRouter.router);

// db connection
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/DMSdatabase");
  console.log("database connected");
}

app.listen(PORT, (req, res) => {
  console.log(`server up on port ${PORT}`);
});
