const request = require("supertest");
const { expect } = require("expect");

const app = require("../dist/index.js").default;

describe("Testing the app", () => {
  it("respond with html page", async () => {
    const res = await request(app).get("/");

    expect(res.status).toBe(200);
    expect(res.body).toBeTruthy();
    expect(res.headers["content-type"]).toContain("text/html");
  });
});
