import { StatusCodes } from "http-status-codes";
import { playerSchema } from "../schema.js";
import { createPlayer } from "../db.js";
import { generateTokens } from "../token.js";

const pgUniqueConstraintViolated = "23505";

const signup = async (req, res) => {
  const result = playerSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(StatusCodes.BAD_REQUEST).json(result.error.format());
  }

  const { email, name, password } = result.data;
  try {
    const player = await createPlayer({ email, name, password });
    const tokens = await generateTokens({
      playerId: player.id,
      email: player.email,
    });

    return res.status(StatusCodes.CREATED).json({ ...player, ...tokens });
  } catch (err) {
    if (err.code === pgUniqueConstraintViolated) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ error: "Player already exists" });
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: err.message });
  }
};

export default signup;
