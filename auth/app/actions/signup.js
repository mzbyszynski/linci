import { StatusCodes } from "http-status-codes";
import { userSchema } from "../schema.js";
import { createUser } from "../db.js";
import { generateTokens } from "../token.js";

const pgUniqueConstraintViolated = "23505";

const signup = async (req, res) => {
  const result = userSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(StatusCodes.BAD_REQUEST).json(result.error.format());
  }

  const { email, name, password } = result.data;
  try {
    const user = await createUser({ email, name, password });
    const tokens = generateTokens({ userId: user.id, email: user.email });

    return res.status(StatusCodes.CREATED).json({ ...user, ...tokens });
  } catch (err) {
    if (err.code === pgUniqueConstraintViolated) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ error: "User already exists" });
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: err.message });
  }
};

export default signup;
