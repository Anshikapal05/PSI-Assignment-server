const request = require("supertest");
const app = require("../app"); // your Express app
const mongoose = require("mongoose");
const Task = require("../models/Task");

describe("Task API", () => {
  beforeAll(async () => {
    // Optional: connect to test DB
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("GET /api/tasks - should return 200", async () => {
    const res = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer <your-valid-token>`); // use a real JWT
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  // Add more tests for POST, DELETE, etc.
});
