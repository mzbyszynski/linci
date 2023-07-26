import pg from "pg";
import supertest from "supertest";
import { StatusCodes } from "http-status-codes";
import jose from "node-jose";
import * as ks from "./keystore.js";
import app from "./server";

vi.mock("pg", () => {
  const Pool = vi.fn();
  Pool.prototype.query = vi.fn();
  return { default: { Pool } };
});

vi.mock("./keystore.js");

let pool;
const keystore = jose.JWK.createKeyStore();
const key = await keystore.generate("RSA", 2048, {
  alg: "RS256",
  use: "sig",
});

beforeEach(async () => {
  pool = new pg.Pool();
  vi.stubEnv("ACCESS_TOKEN_EXPIRE_SECONDS", "300");
  vi.stubEnv("REFRESH_TOKEN_EXPIRE_SECONDS", "600");
});

describe("/login", () => {
  test("responds to get requests with 404", async () => {
    const response = await supertest(app).get("/login");
    expect(response.status).toEqual(StatusCodes.NOT_FOUND);
  });

  test("responds to valid requests with expected status code", async () => {
    const playerData = {
      id: 123,
      name: "Test Name",
      email: "user@example.com",
    };
    pool.query.mockResolvedValue({ rows: [playerData] });
    vi.spyOn(ks, "getKey").mockReturnValue(key);

    const response = await supertest(app)
      .post("/login")
      .set("Content-Type", "application/json")
      .send({
        email: "user@example.com",
        password: "1231231231212",
      });
    expect(ks.getKey).toHaveBeenCalled();
    expect(response.status).toEqual(StatusCodes.OK);
  });

  test("responds to valid requests with expected response body", async () => {
    const playerData = {
      id: 123,
      name: "Test Name",
      email: "user@example.com",
    };
    pool.query.mockResolvedValue({ rows: [playerData] });
    vi.spyOn(ks, "getKey").mockReturnValue(key);

    const response = await supertest(app).post("/login").send({
      email: "user@example.com",
      password: "1231231231212",
    });

    expect(response.body).toEqual({
      ...playerData,
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

    vi.spyOn(ks, "getKey").mockReturnValue(key);

    const response = await supertest(app)
      .post("/signup")
      .send({ ...validInput });

    expect(response.status).toEqual(StatusCodes.CREATED);
  });

  test("responds to valid requests with expected body", async () => {
    const playerData = {
      id: 1324,
      email: validInput.email,
      name: validInput.name,
    };

    pool.query.mockResolvedValue({
      rows: [playerData],
    });

    vi.spyOn(ks, "getKey").mockReturnValue(key);

    const response = await supertest(app)
      .post("/signup")
      .send({ ...validInput });

    expect(response.body).toEqual({
      ...playerData,
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
  });
});
