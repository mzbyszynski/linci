import jose from "node-jose";
import { getKey } from "./keystore.js";

export const generateTokens = async ({ playerId, email }) => {
  const key = getKey();
  const opt = { compact: true, jwk: key, fields: { type: "jwt" } };
  const nowSeconds = Math.floor(Date.now() / 1000);
  const accessPayload = {
    iat: nowSeconds,
    exp: nowSeconds + parseInt(process.env.ACCESS_TOKEN_EXPIRE_SECONDS, 10),
    sub: playerId,
    email,
  };

  const accessToken = await jose.JWS.createSign(opt, key)
    .update(JSON.stringify(accessPayload))
    .final();

  const refreshPayload = {
    iat: nowSeconds,
    exp: nowSeconds + parseInt(process.env.REFRESH_TOKEN_EXPIRE_SECONDS, 10),
    sub: playerId,
  };

  const refreshToken = await jose.JWS.createSign(opt, key)
    .update(JSON.stringify(refreshPayload))
    .final();
  return { accessToken, refreshToken };
};
