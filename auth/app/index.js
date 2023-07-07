import dotenv from "dotenv";
import Router from "express-promise-router";
import express from "express";
import login from "./actions/login";
import signup from "./actions/signup";

dotenv.config();

const router = new Router();

router.post("/login", login);
router.post("/signup", signup);

const app = express();

app.use(express.json());
app.use(router);

export default app;
