import { generateTokens } from "./token";

const userId = 100;
const email = "user@example.com";

beforeEach(() => {
  vi.stubEnv("ACCESS_TOKEN_KEY", "asdfsab");
  vi.stubEnv("REFRESH_TOKEN_KEY", "232223rwsfas");
  vi.stubEnv("ACCESS_TOKEN_EXPIRE", "5m");
  vi.stubEnv("REFRESH_TOKEN_EXPIRE", "10m");
});

test("generates access token", () => {
  expect(generateTokens({ userId, email })).toHaveProperty("accessToken");
});

test("generates refresh token", () => {
  expect(generateTokens({ userId, email })).toHaveProperty("refreshToken");
});
