import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// routes
import UserRoutes from "./routes/UserRoute.js";

app.use("/api", UserRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("db connected to app");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(process.env.PORT, () => {
  console.log(`server connected to port ${process.env.PORT}`);
});
