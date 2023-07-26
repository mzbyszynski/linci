import { initializeKeystore } from "./keystore";
import { generateTokens } from "./token";
import mockFs from "mock-fs";

const playerId = 100;
const email = "user@example.com";

beforeEach(() => {
  vi.stubEnv("ACCESS_TOKEN_EXPIRE_SECONDS", "300");
  vi.stubEnv("REFRESH_TOKEN_EXPIRE_SECONDS", "600");
  // For keystore
  mockFs({
    public: {
      // Empty directory
    },
  });
});

afterEach(() => {
  mockFs.restore();
});

test("generates access token", async () => {
  await initializeKeystore();
  expect(generateTokens({ playerId, email })).resolves.toHaveProperty(
    "accessToken",
  );
});

test("generates refresh token", async () => {
  await initializeKeystore();
  expect(generateTokens({ playerId, email })).resolves.toHaveProperty(
    "refreshToken",
  );
});
