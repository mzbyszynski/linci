import * as dotenv from "dotenv";
import express from "express";
import login from "./actions/login";

dotenv.config();
const app = express();

app.use(express.json());
app.use("/login", login);

export default app;
