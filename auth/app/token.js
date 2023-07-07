import jwt from "jsonwebtoken";

export const generateTokens = ({ userId, email }) => {
  const accessToken = jwt.sign(
    { userId, email },
    process.env.ACCESS_TOKEN_KEY,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
    },
  );

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_KEY, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
  });
  return { accessToken, refreshToken };
};
