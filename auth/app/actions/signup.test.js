import pg from "pg";
import { getMockReq, getMockRes } from "vitest-mock-express";
import { StatusCodes } from "http-status-codes";
import signup from "./signup";

vi.mock("pg", () => {
  const Pool = vi.fn();
  Pool.prototype.query = vi.fn();
  return { default: { Pool } };
});

let pool;

const validInput = {
  email: "test@example.com",
  name: "Test User",
  password: "23rdsfs asdfsdafas",
};

beforeEach(() => {
  pool = new pg.Pool();
  vi.stubEnv("ACCESS_TOKEN_KEY", "asdfsab");
  vi.stubEnv("REFRESH_TOKEN_KEY", "232223rwsfas");
  vi.stubEnv("ACCESS_TOKEN_EXPIRE", "5m");
  vi.stubEnv("REFRESH_TOKEN_EXPIRE", "10m");
});

test.each`
  prop
  ${"email"}
  ${"name"}
  ${"password"}
`("returns BAD_REQUEST when $prop is missing", async ({ prop }) => {
  const { res } = getMockRes();
  const body = { ...validInput };
  delete body[prop];
  const req = getMockReq({ body });
  await signup(req, res);
  expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
});

test("returns CONFLICT if the user already exists", async () => {
  const err = new Error("Unique Constraint");
  err.code = "23505";
  pool.query.mockRejectedValue(err);
  const { res } = getMockRes();
  const req = getMockReq({ body: { ...validInput } });
  await signup(req, res);
  expect(res.status).toHaveBeenCalledWith(StatusCodes.CONFLICT);
});

test("returns INTERNAL_SERVER_ERROR if db throws unexpected error", async () => {
  const err = new Error("Unique Constraint");
  err.code = "666";
  pool.query.mockRejectedValue(err);
  const { res } = getMockRes();
  const req = getMockReq({ body: { ...validInput } });
  await signup(req, res);
  expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
});

test("returns CREATED when signup is successful", async () => {
  pool.query.mockResolvedValue({
    rows: [
      {
        id: 1324,
        email: validInput.email,
        name: validInput.name,
      },
    ],
  });
  const { res } = getMockRes();
  const req = getMockReq({ body: { ...validInput } });
  await signup(req, res);
  expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
});

test("returns the expected payload when signup is successful", async () => {
  const userData = {
    id: 1324,
    email: validInput.email,
    name: validInput.name,
  };

  pool.query.mockResolvedValue({
    rows: [userData],
  });

  const { res } = getMockRes();
  const req = getMockReq({ body: { ...validInput } });
  await signup(req, res);

  expect(res.json).toHaveBeenCalledWith({
    ...userData,
    accessToken: expect.any(String),
    refreshToken: expect.any(String),
  });
});
