import { Pool } from "pg";
import { getMockReq, getMockRes } from "vitest-mock-express";
import login from "./login";
import { StatusCodes } from "http-status-codes";

vi.mock("pg", () => {
  const Pool = vi.fn();
  Pool.prototype.query = vi.fn();
  return { Pool };
});

let pool;

beforeEach(() => {
  pool = new Pool();
  vi.stubEnv("ACCESS_TOKEN_KEY", "asdfsab");
  vi.stubEnv("REFRESH_TOKEN_KEY", "232223rwsfas");
  vi.stubEnv("ACCESS_TOKEN_EXPIRE", "5m");
  vi.stubEnv("REFRESH_TOKEN_EXPIRE", "10m");
});

test("returns BAD_REQUEST when password is not provided", async () => {
  const { res } = getMockRes();
  const req = getMockReq({ body: { email: "user@example.com" } });
  await login(req, res);
  expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
});

test("returns BAD_REQUEST when email is not provided", async () => {
  const { res } = getMockRes();
  const req = getMockReq({ body: { password: "12312123112" } });
  await login(req, res);
  expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
});

test("returns Unauthorized when no user is found", async () => {
  pool.query.mockResolvedValue({ rows: [] });
  const { res } = getMockRes();
  const req = getMockReq({
    body: { email: "user@example.com", password: "12312123112" },
  });
  await login(req, res);
  expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
});

test("returns OK when user is found", async () => {
  const userData = {
    id: 123,
    name: "Test Name",
    email: "user@example.com",
  };
  pool.query.mockResolvedValue({ rows: [userData] });
  const { res } = getMockRes();
  const req = getMockReq({
    body: { email: "user@example.com", password: "12312123112" },
  });
  await login(req, res);
  expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
});

test("returns expected payload when user is found", async () => {
  const userData = {
    id: 123,
    name: "Test Name",
    email: "user@example.com",
  };
  pool.query.mockResolvedValue({ rows: [userData] });

  const { res } = getMockRes();
  const req = getMockReq({
    body: { email: "user@example.com", password: "12312123112" },
  });
  await login(req, res);

  expect(res.json).toHaveBeenCalledWith({
    ...userData,
    accessToken: expect.any(String),
    refreshToken: expect.any(String),
  });
});
