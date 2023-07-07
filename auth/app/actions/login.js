import { getUser } from "../db";
import { generateTokens } from "../token";
import { credentialsSchema } from "../schema";
import { StatusCodes } from "http-status-codes";

const login = async (req, res) => {
  const result = credentialsSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(StatusCodes.BAD_REQUEST).json(result.error.format());
  }

  const { email, password } = result.data;
  const user = await getUser({ email, password });

  if (user) {
    const tokens = generateTokens({ userId: user.id, email: user.email });
    return res.status(StatusCodes.OK).json({ ...user, ...tokens });
  }

  return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
};

export default login;
