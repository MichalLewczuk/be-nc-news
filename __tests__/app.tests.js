const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app");

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
  test("Returns 200 status code and array of all topics", async () => {
    const res = await request(app).get("/api/topics").expect(200);
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

describe("GET /api/articles/:article_id", () => {
  test("Returns 200 status code and an article object matching give id", async () => {
    const article_id = 3;
    const { body } = await request(app)
      .get(`/api/articles/${article_id}`)
      .expect(200);
    expect(body.article).toEqual({
      article_id: 3,
      title: "Eight pug gifs that remind me of mitch",
      topic: "mitch",
      author: "icellusedkars",
      body: "some gifs",
      created_at: "2020-11-03T09:12:00.000Z",
      votes: 0,
    });
  });
  test("Returns 400 status code and a bad request msg for invalid article_id request", async () => {
    const article_id = "dog";
    const { body } = await request(app)
      .get(`/api/articles/${article_id}`)
      .expect(400);
    expect(body.msg).toEqual("Bad request");
  });
  test("Returns 404 status code and a not found msg for article_id that's not in the database", async () => {
    const article_id = 99;
    const { body } = await request(app)
      .get(`/api/articles/${article_id}`)
      .expect(404);
    expect(body.msg).toEqual("No article with id 99 found in the database");
  });
});
