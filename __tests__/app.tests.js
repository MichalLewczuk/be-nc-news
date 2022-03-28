const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app");
const { expect, test } = require("@jest/globals");

afterAll(() => {
  db.end();
});
beforeEach(() => seed(testData));

describe("my server", () => {
  test("still works", () => {});
});

describe("Unknown endpoint", () => {
  test("Returns 404 status code", () => {
    return request(app).get("/not-a-route").expect(404);
  });
});

describe("GET /api/topics", () => {
  test("Returns 200 status code and array of all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        expect(res.body.topics).toBeInstanceOf(Array);
        expect(res.body.topics.length).toBe(3);
        res.body.topics.forEach((topic) => {
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
          });
        });
      });
  });
});
