const request = require("supertest");
const { expect } = require("expect");

const app = "http://localhost:4000";

describe("API endpoints testing", () => {
  describe("GET /", () => {
    it("respond with html page", async () => {
      const res = await request(app).get("/");

      expect(res.status).toBe(200);
      expect(res.body).toBeTruthy();
      expect(res.headers["content-type"]).toContain("text/html");
    });
  });

  describe("GET /api/user", () => {
    it("should error because there's no token", async () => {
      const res = await request(app).get("/api/user/");

      expect(res.status).toBe(401);
      expect(await res.body).toMatchObject({
        ok: false,
        message: "Invalid Authorization Token",
        cause: "Token is missing",
      });
    });

    it("should error because token is invalid", async () => {
      const res = await request(app)
        .get("/api/user")
        .set({ Authorization: "fake_token" });

      expect(res.status).toBe(401);
      expect(await res.body).toMatchObject({
        ok: false,
        message: "Invalid Authorization Token",
      });
    });

    it("should fetch a new token and then try to get a user", async () => {
      const reqToken = await request(app).get("/api/auth");

      expect(reqToken.status).toBe(200);

      const reqTokenBody = await reqToken.body;
      expect(reqTokenBody).toHaveProperty("ok", true);
      expect(reqTokenBody.value).toBeTruthy();
      expect(typeof reqTokenBody.value).toBe("string");

      const token = await reqToken.body.value;
      const email = "test@test.com";

      const res = await request(app)
        .get(`/api/user?email=${email}`)
        .set({ Authorization: `Bearer ${token}` });
      const resBody = await res.body;

      expect(res.status).toBe(200);
      expect(resBody).toHaveProperty("ok", true);
      expect(resBody.value).toBeDefined();
      expect(resBody.value.email).toBe(email);
      expect(resBody.value.id).toBeTruthy();
    });
  });
});
