const request = require("supertest");
const { expect } = require("expect");

const app = "http://localhost:4000";

describe("API endpoints testing", () => {
  describe("GET /", () => {
    it("respond with html page", async () => {
      const res = await request(app).get("/").expect(200);

      expect(res.body).toBeTruthy();
      expect(res.headers["content-type"]).toContain("text/html");
    });
  });

  describe("GET /api/user", () => {
    it("should error because there's no token", async () => {
      const res = await request(app).get("/api/user").expect(401);

      expect(await res.body).toMatchObject({
        ok: false,
        message: "Invalid Authorization Token",
        cause: "Token is missing",
      });
    });

    it("should error because token is invalid", async () => {
      const res = await request(app)
        .get("/api/user")
        .set({ Authorization: "fake_token" })
        .expect(401);

      expect(await res.body).toMatchObject({
        ok: false,
        message: "Invalid Authorization Token",
      });
    });

    it("fail to fetch app token because admin token is missing", async () => {
      const res = await request(app).get("/api/token").expect(401);

      const body = await res.body;
      expect(body).toHaveProperty("ok", false);
      expect(body).toHaveProperty("message", "Admin token is missing");

      // const token = await reqToken.body.value;
      // const email = "test@test.com";

      // const res = await request(app)
      //   .get(`/api/user?email=${email}`)
      //   .set({ Authorization: `Bearer ${token}` });
      // const resBody = await res.body;

      // expect(res.status).toBe(200);
      // expect(resBody).toHaveProperty("ok", true);
      // expect(resBody.value).toBeDefined();
      // expect(resBody.value.email).toBe(email);
      // expect(resBody.value.id).toBeTruthy();
    });

    it("fail to fetch app token because admin token is invalid", async () => {
      const res = await request(app)
        .get("/api/token")
        .set({ Authorization: "Bearer fake_token" })
        .expect(401);

      const body = await res.body;
      expect(body).toHaveProperty("ok", false);
      expect(body).toHaveProperty("message", "Invalid Admin Token");
    });

    it("fecth admin token then fetch app token and finally fetch user", async () => {
      const reqAdminToken = await request(app)
        .post("/api/login")
        .send({ user: { email: "admin@admin.com", password: "user_admin" } })
        .expect(200);

      const reqAdminTokenBody = await reqAdminToken.body;
      expect(reqAdminTokenBody).toHaveProperty("ok", true);

      const adminToken = reqAdminTokenBody.value;

      const reqAppToken = await request(app)
        .get("/api/token")
        .set({ Authorization: `Bearer ${adminToken}` })
        .expect(200);

      const reqAppTokenBody = await reqAppToken.body;
      expect(reqAppTokenBody).toHaveProperty("ok", true);

      const appToken = reqAppTokenBody.value;

      const email = "test@test.com";
      const res = await request(app)
        .get(`/api/user?email=${email}`)
        .set({ Authorization: `Bearer ${appToken}` })
        .expect(200);

      const body = await res.body;
      expect(body).toHaveProperty("ok", true);
      expect(body.value.email).toBeTruthy();
      expect(body.value.id).toBeTruthy();
    });
  });
});
