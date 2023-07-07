import Router from "express-promise-router";
import jwt from "jsonwebtoken";
import { getUser } from "../db";

const router = new Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!(email && password)) {
    return res.status(400).send("All input is required");
  }

  const user = await getUser(email, password);

  if (user) {
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.TOKEN_KEY,
      {
        expires: "12h",
      },
    );

    return res.status(200).json({ ...user, token });
  }

  return res.status(403).send("Unauthorized");
});

export default router;
