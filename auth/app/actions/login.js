import { getPlayer } from "../db.js";
import { generateTokens } from "../token.js";
import { credentialsSchema } from "../schema.js";
import { StatusCodes } from "http-status-codes";

const login = async (req, res) => {
  const result = credentialsSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(StatusCodes.BAD_REQUEST).json(result.error.format());
  }

  const { email, password } = result.data;
  const player = await getPlayer({ email, password });

  if (player) {
    const tokens = await generateTokens({
      playerId: player.id,
      email: player.email,
    });
    return res.status(StatusCodes.OK).json({ ...player, ...tokens });
  }

  return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
};

export default login;
