import pg from "pg";
import { createPlayer, getPlayer } from "./db";

vi.mock("pg", () => {
  const Pool = vi.fn();
  Pool.prototype.query = vi.fn();
  return { default: { Pool } };
});

describe("getPlayer()", () => {
  let pool;

  beforeEach(() => {
    pool = new pg.Pool();
  });

  test("returns null when no rows are returned", async () => {
    pool.query.mockResolvedValue({ rows: [] });
    expect(
      getPlayer({ email: "user@example.com", password: "1234565423" }),
    ).resolves.toBeNull();
  });

  test("returns player returned from query", async () => {
    const playerData = {
      id: 123,
      name: "Test Name",
      email: "test_user@example.com",
    };

    pool.query.mockResolvedValue({ rows: [playerData] });

    expect(
      getPlayer({ email: playerData.email, password: "2332234324r22" }),
    ).resolves.toBe(playerData);
  });
});

describe("createPlayer()", () => {
  let pool;

  beforeEach(() => {
    pool = new pg.Pool();
  });

  it("returns player data returned by query", async () => {
    const playerData = {
      id: 123,
      name: "Test Name",
      email: "test_user@example.com",
    };

    pool.query.mockResolvedValue({ rows: [playerData] });

    expect(
      createPlayer({
        email: playerData.email,
        name: playerData.name,
        password: "2332234324r22",
      }),
    ).resolves.toBe(playerData);
  });
});
