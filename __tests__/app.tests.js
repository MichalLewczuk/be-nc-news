const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app");

afterAll(() => {
  db.end();
});
beforeEach(() => seed(testData));

describe("OTHER TESTS", () => {
  describe("my server", () => {
    test("still works", () => {});
  });

  describe("Unknown endpoint", () => {
    test("Returns 404 status code", () => {
      return request(app).get("/not-a-route").expect(404);
    });
  });
});

describe("TOPICS TESTS", () => {
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
});

describe("ARTICLES TESTS", () => {
  describe("GET /api/articles/:article_id", () => {
    test("Returns 200 status code and an article object wtih comment_count matching given id", async () => {
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
        comment_count: "2",
      });
    });
    test("Returns 200 status code and an article object with comment_count 0 for articles with no comments", async () => {
      const article_id = 7;
      const { body } = await request(app)
        .get(`/api/articles/${article_id}`)
        .expect(200);
      expect(body.article).toEqual({
        article_id: 7,
        title: "Z",
        topic: "mitch",
        author: "icellusedkars",
        body: "I was hungry.",
        created_at: "2020-01-07T14:08:00.000Z",
        votes: 0,
        comment_count: "0",
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

  describe("PATCH /api/articles/:article_id", () => {
    test("Returns 200 status code and an updated article", async () => {
      const newVote = 25;
      const articleUpdates = {
        inc_votes: newVote,
      };
      const article_id = 3;
      const { body } = await request(app)
        .patch(`/api/articles/${article_id}`)
        .send(articleUpdates)
        .expect(200);
      expect(body.article).toEqual({
        article_id: 3,
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: "2020-11-03T09:12:00.000Z",
        votes: 0 + newVote,
      });
    });
    test("Returns 400 status code if article_id is not valid", async () => {
      const newVote = 20;
      const articleUpdates = {
        inc_votes: newVote,
      };
      const article_id = "notAnId";
      const { body } = await request(app)
        .patch(`/api/articles/${article_id}`)
        .send(articleUpdates)
        .expect(400);
      expect(body.msg).toEqual("Bad request");
    });
    test("Returns 404 status code if article_id not in the database", async () => {
      const newVote = 20;
      const articleUpdates = {
        inc_votes: newVote,
      };
      const article_id = 99;
      const { body } = await request(app)
        .patch(`/api/articles/${article_id}`)
        .send(articleUpdates)
        .expect(404);
      expect(body.msg).toEqual("No article with id 99 found in the database");
    });
    test("Returns 400 status code if patch body value not valid", async () => {
      const newVote = "invalidVote";
      const articleUpdates = {
        inc_votes: newVote,
      };
      const article_id = 3;
      const { body } = await request(app)
        .patch(`/api/articles/${article_id}`)
        .send(articleUpdates)
        .expect(400);
      expect(body.msg).toEqual("Bad request");
    });
    test("Returns 400 status code if patch body key not valid", async () => {
      const newVote = 22;
      const articleUpdates = {
        inc_vote: newVote,
      };
      const article_id = 3;
      const { body } = await request(app)
        .patch(`/api/articles/${article_id}`)
        .send(articleUpdates)
        .expect(400);
      expect(body.msg).toEqual("Invalid request body");
    });
    test("Returns 400 status code if patch body not valid", async () => {
      const newVote = 22;
      const articleUpdates = {
        inc_vote: newVote,
        title: "New Title",
      };
      const article_id = 3;
      const { body } = await request(app)
        .patch(`/api/articles/${article_id}`)
        .send(articleUpdates)
        .expect(400);
      expect(body.msg).toEqual("Invalid request body");
    });
  });
});

describe("USERS TESTS", () => {
  describe("GET /api/users", () => {
    test("Returns 200 status code and array of all users", async () => {
      const res = await request(app).get("/api/users").expect(200);
      expect(res.body.users).toBeInstanceOf(Array);
      expect(res.body.users.length).toBe(4);
      res.body.users.forEach((user) => {
        expect(user).toMatchObject({
          username: expect.any(String),
        });
      });
    });
  });
});
