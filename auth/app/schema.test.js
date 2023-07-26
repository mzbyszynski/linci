import { describe } from "vitest";
import { playerSchema } from "./schema";

describe("playerSchema", () => {
  const validPlayer = {
    email: "user@example.com",
    name: "My Name is!",
    password: "SDFOIIJOmasd asdfas",
  };

  describe("email", () => {
    test("fails invalid email", () => {
      const result = playerSchema.safeParse({
        ...validPlayer,
        email: "invalid_email ",
      });

      expect(result).toHaveProperty("success", false);
      expect(result).toHaveProperty("error.issues", [
        expect.objectContaining({ validation: "email" }),
      ]);
    });

    test("converts to lower case", () => {
      const result = playerSchema.safeParse({
        ...validPlayer,
        email: "CAPS-USER@Example.Com",
      });

      expect(result).toHaveProperty("success", true);
      expect(result).toHaveProperty("data.email", "caps-user@example.com");
    });

    test("trims starting and trailing whitespace", () => {
      const result = playerSchema.safeParse({
        ...validPlayer,
        email: `  space_user@example.com `,
      });
      expect(result).toHaveProperty("success", true);
      expect(result.data).toHaveProperty("email", "space_user@example.com");
    });
  });

  describe("name", () => {
    test("fail names shorter than 1 character", () => {
      const result = playerSchema.safeParse({
        ...validPlayer,
        name: "",
      });

      expect(result).toHaveProperty("success", false);
      expect(result).toHaveProperty("error.issues", [
        expect.objectContaining({ code: "too_small" }),
      ]);
    });

    test("fail names shorter than 1 character excluding whitespace padding", () => {
      const result = playerSchema.safeParse({
        ...validPlayer,
        name: "    ",
      });

      expect(result).toHaveProperty("success", false);
      expect(result).toHaveProperty("error.issues", [
        expect.objectContaining({ code: "too_small" }),
      ]);
    });

    test("trim leading and trailing whitespace", () => {
      const result = playerSchema.safeParse({
        ...validPlayer,
        name: "  Az ",
      });

      expect(result).toHaveProperty("success", true);
      expect(result).toHaveProperty("data.name", "Az");
    });
  });

  describe("password", () => {
    test("fail passwords shorter than 8 characters", () => {
      const result = playerSchema.safeParse({
        ...validPlayer,
        password: "test",
      });

      expect(result).toHaveProperty("success", false);
      expect(result).toHaveProperty("error.issues", [
        expect.objectContaining({ code: "too_small" }),
      ]);
    });

    test("not alter password", () => {
      const result = playerSchema.safeParse({
        ...validPlayer,
        password: " test123 ",
      });

      expect(result).toHaveProperty("success", true);
      expect(result).toHaveProperty("data.password", " test123 ");
    });
  });
});
