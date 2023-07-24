import pg from "pg";
import supertest from "supertest";
import app from "./server";
import { StatusCodes } from "http-status-codes";

vi.mock("pg", () => {
  const Pool = vi.fn();
  Pool.prototype.query = vi.fn();
  return { default: { Pool } };
});

let pool;

beforeEach(() => {
  pool = new pg.Pool();
  vi.stubEnv("ACCESS_TOKEN_KEY", "asdfsab");
  vi.stubEnv("REFRESH_TOKEN_KEY", "232223rwsfas");
  vi.stubEnv("ACCESS_TOKEN_EXPIRE", "5m");
  vi.stubEnv("REFRESH_TOKEN_EXPIRE", "10m");
});

describe("/login", () => {
  test("responds to get requests with 404", async () => {
    const response = await supertest(app).get("/login");
    expect(response.status).toEqual(StatusCodes.NOT_FOUND);
  });

  test("responds to valid requests with expected status code", async () => {
    const userData = {
      id: 123,
      name: "Test Name",
      email: "user@example.com",
    };
    pool.query.mockResolvedValue({ rows: [userData] });

    const response = await supertest(app).post("/login").send({
      email: "user@example.com",
      password: "1231231231212",
    });

    expect(response.status).toEqual(StatusCodes.OK);
  });

  test("responds to valid requests with expected response body", async () => {
    const userData = {
      id: 123,
      name: "Test Name",
      email: "user@example.com",
    };
    pool.query.mockResolvedValue({ rows: [userData] });

    const response = await supertest(app).post("/login").send({
      email: "user@example.com",
      password: "1231231231212",
    });

    expect(response.body).toEqual({
      ...userData,
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
  });
});

describe("/signup", () => {
  const validInput = {
    email: "test@example.com",
    name: "Test User",
    password: "23rdsfs asdfsdafas",
  };

  test("responds to get requests with 404", async () => {
    const response = await supertest(app).get("/signup");
    expect(response.status).toEqual(StatusCodes.NOT_FOUND);
  });

  test("responds to valid requests with expected status code", async () => {
    pool.query.mockResolvedValue({
      rows: [
        {
          id: 1324,
          email: validInput.email,
          name: validInput.name,
        },
      ],
    });

    const response = await supertest(app)
      .post("/signup")
      .send({ ...validInput });

    expect(response.status).toEqual(StatusCodes.CREATED);
  });

  test("responds to valid requests with expected body", async () => {
    const userData = {
      id: 1324,
      email: validInput.email,
      name: validInput.name,
    };

    pool.query.mockResolvedValue({
      rows: [userData],
    });

    const response = await supertest(app)
      .post("/signup")
      .send({ ...validInput });

    expect(response.body).toEqual({
      ...userData,
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
  });
});
