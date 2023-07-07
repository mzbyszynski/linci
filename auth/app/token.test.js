import { afterEach, beforeAll } from "vitest";
import { generateTokens } from "./token";

const userId = 100;
const email = "user@example.com";

let baseEnv;

beforeAll(() => {
  baseEnv = { ...process.env };
});

beforeEach(() => {
  process.env.ACCESS_TOKEN_KEY = "asdfsab";
  process.env.REFRESH_TOKEN_KEY = "232223rwsfas";
  process.env.ACCESS_TOKEN_EXPIRE = "5m";
  process.env.REFRESH_TOKEN_EXPIRE = "10m";
});

afterEach(() => {
  process.env = { ...baseEnv };
});

test("generates access token", () => {
  expect(generateTokens({ userId, email })).toHaveProperty("accessToken");
});

test("generates refresh token", () => {
  expect(generateTokens({ userId, email })).toHaveProperty("refreshToken");
});
