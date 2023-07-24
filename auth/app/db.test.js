import pg from "pg";
import { createUser, getUser } from "./db";

vi.mock("pg", () => {
  const Pool = vi.fn();
  Pool.prototype.query = vi.fn();
  return { default: { Pool } };
});

describe("getUser()", () => {
  let pool;

  beforeEach(() => {
    pool = new pg.Pool();
  });

  test("returns null when no rows are returned", async () => {
    pool.query.mockResolvedValue({ rows: [] });
    expect(
      getUser({ email: "user@example.com", password: "1234565423" }),
    ).resolves.toBeNull();
  });

  test("returns user returned from query", async () => {
    const userData = {
      id: 123,
      name: "Test Name",
      email: "test_user@example.com",
    };

    pool.query.mockResolvedValue({ rows: [userData] });

    expect(
      getUser({ email: userData.email, password: "2332234324r22" }),
    ).resolves.toBe(userData);
  });
});

describe("createUser()", () => {
  let pool;

  beforeEach(() => {
    pool = new pg.Pool();
  });

  it("returns user data returned by query", async () => {
    const userData = {
      id: 123,
      name: "Test Name",
      email: "test_user@example.com",
    };

    pool.query.mockResolvedValue({ rows: [userData] });

    expect(
      createUser({
        email: userData.email,
        name: userData.name,
        password: "2332234324r22",
      }),
    ).resolves.toBe(userData);
  });
});
