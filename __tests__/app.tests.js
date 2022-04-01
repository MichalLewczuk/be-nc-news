const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app");
const endpoints = require("../endpoints.json");

afterAll(() => {
  db.end();
});
beforeEach(() => seed(testData));

describe("OTHER TESTS", () => {
  describe("Unknown endpoint", () => {
    test("Returns 404 status code", () => {
      return request(app).get("/not-a-route").expect(404);
    });
  });

  describe("GET /api", () => {
    test("Returns status 200 and JSON with all api endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual(endpoints);
        });
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
  describe("GET /api/articles", () => {
    test("Returns 200 status code and array of all articles sorted by date in descending order", async () => {
      const res = await request(app).get("/api/articles").expect(200);
      expect(res.body.articles).toBeInstanceOf(Array);
      expect(res.body.articles.length).toBe(12);
      expect(res.body.articles).toBeSortedBy("created_at", {
        descending: true,
      });
      res.body.articles.forEach((article) => {
        expect(article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          comment_count: expect.any(Number),
        });
      });
    });
    test("Returns 200 status code and array of all articles sorted by date in given order", async () => {
      const res = await request(app).get("/api/articles?order=asc").expect(200);
      expect(res.body.articles).toBeInstanceOf(Array);
      expect(res.body.articles.length).toBe(12);
      expect(res.body.articles).toBeSortedBy("created_at");
      res.body.articles.forEach((article) => {
        expect(article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          comment_count: expect.any(Number),
        });
      });
    });
    test("Returns 200 status code and array of all articles sorted by given column in given order", async () => {
      const res = await request(app)
        .get("/api/articles?sort_by=comment_count&order=asc")
        .expect(200);
      expect(res.body.articles).toBeInstanceOf(Array);
      expect(res.body.articles.length).toBe(12);
      expect(res.body.articles).toBeSortedBy("comment_count");
      res.body.articles.forEach((article) => {
        expect(article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          comment_count: expect.any(Number),
        });
      });
    });

    test("Returns 200 status code and array of all articles sorted by given column in given order and filtered by given topic", async () => {
      const res = await request(app)
        .get("/api/articles?sort_by=comment_count&order=asc&topic=mitch")
        .expect(200);
      expect(res.body.articles).toBeInstanceOf(Array);
      expect(res.body.articles.length).toBe(11);
      expect(res.body.articles).toBeSortedBy("comment_count");
      res.body.articles.forEach((article) => {
        expect(article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          comment_count: expect.any(Number),
        });
      });
    });

    test("Returns 200 status code and array of all articles in given order and filtered by given topic", async () => {
      const res = await request(app)
        .get("/api/articles?topic=mitch&order=DESC")
        .expect(200);
      expect(res.body.articles).toBeInstanceOf(Array);
      expect(res.body.articles.length).toBe(11);
      expect(res.body.articles).toBeSortedBy("created_at", {
        descending: true,
      });
      res.body.articles.forEach((article) => {
        expect(article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          comment_count: expect.any(Number),
        });
      });
    });

    test("Returns 200 status code and en empty array if no articles with given topic", async () => {
      const res = await request(app)
        .get("/api/articles?topic=paper")
        .expect(200);
      expect(res.body.articles).toEqual([]);
    });

    test("Returns 404 status code if given topic not in the database", async () => {
      const res = await request(app)
        .get("/api/articles?topic=northcoders")
        .expect(404);
      expect(res.body.msg).toBe(`slug northcoders not found in the database`);
    });

    test("Returns 400 status code if given invalid sort_by", async () => {
      const res = await request(app)
        .get("/api/articles?sort_by=northcoders")
        .expect(400);
      expect(res.body.msg).toBe(`Not a valid sort_by query`);
    });

    test("Returns 400 status code if given invalid order", async () => {
      const res = await request(app)
        .get("/api/articles?order=northcoders")
        .expect(400);
      expect(res.body.msg).toBe(`Not a valid order query`);
    });
  });

  describe("GET /api/articles/:article_id", () => {
    test("Returns 200 status code and an article object with comment_count matching given id", async () => {
      const { body } = await request(app).get(`/api/articles/3`).expect(200);
      expect(body.article).toEqual({
        article_id: 3,
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: "2020-11-03T09:12:00.000Z",
        votes: 0,
        comment_count: 2,
      });
    });

    test("Returns 200 status code and an article object with comment_count 0 for articles with no comments", async () => {
      const { body } = await request(app).get(`/api/articles/7`).expect(200);
      expect(body.article).toEqual({
        article_id: 7,
        title: "Z",
        topic: "mitch",
        author: "icellusedkars",
        body: "I was hungry.",
        created_at: "2020-01-07T14:08:00.000Z",
        votes: 0,
        comment_count: 0,
      });
    });

    test("Returns 400 status code and a bad request msg for invalid article_id request", async () => {
      const { body } = await request(app).get(`/api/articles/dog`).expect(400);
      expect(body.msg).toEqual("Bad request");
    });

    test("Returns 404 status code and a not found msg for article_id that's not in the database", async () => {
      const { body } = await request(app).get(`/api/articles/99`).expect(404);
      expect(body.msg).toEqual("article_id 99 not found in the database");
    });
  });

  describe("PATCH /api/articles/:article_id", () => {
    test("Returns 200 status code and an updated article", async () => {
      const articleUpdates = {
        inc_votes: 25,
      };
      const { body } = await request(app)
        .patch(`/api/articles/3`)
        .send(articleUpdates)
        .expect(200);
      expect(body.article).toEqual({
        article_id: 3,
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: "2020-11-03T09:12:00.000Z",
        votes: 25,
      });
    });

    test("Returns 400 status code if article_id is not valid", async () => {
      const articleUpdates = {
        inc_votes: 20,
      };
      const { body } = await request(app)
        .patch(`/api/articles/"notAnId"`)
        .send(articleUpdates)
        .expect(400);
      expect(body.msg).toEqual("Bad request");
    });

    test("Returns 404 status code if article_id not in the database", async () => {
      const articleUpdates = {
        inc_votes: 20,
      };
      const { body } = await request(app)
        .patch(`/api/articles/99`)
        .send(articleUpdates)
        .expect(404);
      expect(body.msg).toEqual("article_id 99 not found in the database");
    });

    test("Returns 400 status code if patch body value not valid", async () => {
      const articleUpdates = {
        inc_votes: "invalidVote",
      };
      const { body } = await request(app)
        .patch(`/api/articles/3`)
        .send(articleUpdates)
        .expect(400);
      expect(body.msg).toEqual("Bad request");
    });

    test("Returns 400 status code if patch body key not valid", async () => {
      const articleUpdates = {
        inc_vote: 22,
      };
      const { body } = await request(app)
        .patch(`/api/articles/3`)
        .send(articleUpdates)
        .expect(400);
      expect(body.msg).toEqual("Invalid request body");
    });

    test("Returns 400 status code if patch body not valid", async () => {
      const articleUpdates = {
        inc_vote: 22,
        title: "New Title",
      };
      const { body } = await request(app)
        .patch(`/api/articles/3`)
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

  describe("GET /api/users/:username", () => {
    test("Returns 200 status code and a user object matching given username", async () => {
      const { body } = await request(app)
        .get(`/api/users/icellusedkars`)
        .expect(200);
      expect(body.user).toEqual({
        username: "icellusedkars",
        name: "sam",
        avatar_url:
          "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
      });
    });

    test("Returns 404 status code and a not found msg for username that's not in the database", async () => {
      const { body } = await request(app)
        .get(`/api/users/notInDatabase`)
        .expect(404);
      expect(body.msg).toEqual(
        `username notInDatabase not found in the database`
      );
    });
  });
});

describe("COMMENTS TESTS", () => {
  describe("GET /api/articles/:article_id/comments", () => {
    test("Returns 200 status code and array of all comments for given article id", async () => {
      const res = await request(app)
        .get("/api/articles/1/comments")
        .expect(200);
      expect(res.body.comments).toBeInstanceOf(Array);
      expect(res.body.comments.length).toBe(11);
      res.body.comments.forEach((comment) => {
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          body: expect.any(String),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
        });
      });
    });

    test("Returns 200 status code and an empty array for article with no comments", async () => {
      const res = await request(app)
        .get("/api/articles/8/comments")
        .expect(200);
      expect(res.body.comments).toBeInstanceOf(Array);
      expect(res.body.comments.length).toBe(0);
      expect(res.body.comments).toEqual([]);
    });

    test("Returns 404 status code when article id not in the database", async () => {
      const res = await request(app)
        .get("/api/articles/99/comments")
        .expect(404);
      expect(res.body.msg).toBe(`article_id 99 not found in the database`);
    });

    test("Returns 400 status code when article id is not valid", async () => {
      const res = await request(app)
        .get("/api/articles/notAnId/comments")
        .expect(400);
      expect(res.body.msg).toBe(`Bad request`);
    });
  });

  describe("POST /api/articles/:article_id/comments", () => {
    test("Returns 201 status code and the posted comment", async () => {
      const newComment = {
        username: "icellusedkars",
        body: "this is a test comment",
      };
      const { body } = await request(app)
        .post(`/api/articles/9/comments`)
        .send(newComment)
        .expect(201);
      expect(body.comment).toMatchObject({
        comment_id: 19,
        article_id: 9,
        author: "icellusedkars",
        body: "this is a test comment",
        created_at: expect.any(String),
        votes: 0,
      });
    });

    test("Returns 400 status code if article_id is not valid", async () => {
      const newComment = {
        username: "icellusedkars",
        body: "this is a test comment",
      };
      const { body } = await request(app)
        .post(`/api/articles/"notAnId"/comments`)
        .send(newComment)
        .expect(400);
      expect(body.msg).toEqual("Bad request");
    });

    test("Returns 404 status code if article_id not in the database", async () => {
      const newComment = {
        username: "icellusedkars",
        body: "this is a test comment",
      };
      const { body } = await request(app)
        .post(`/api/articles/999/comments`)
        .send(newComment)
        .expect(404);
      expect(body.msg).toEqual("article_id 999 not found in the database");
    });

    test("Returns 400 status code if post body key not valid", async () => {
      const newComment = {
        name: "icellusedkars",
        body: "this is a test comment",
      };
      const { body } = await request(app)
        .post(`/api/articles/3/comments`)
        .send(newComment)
        .expect(400);
      expect(body.msg).toEqual("Invalid request body");
    });

    test("Returns 400 status code if post body not valid", async () => {
      const newComment = {
        username: "icellusedkars",
        body: "this is a test comment",
        votes: 12,
      };
      const { body } = await request(app)
        .post(`/api/articles/3/comments`)
        .send(newComment)
        .expect(400);
      expect(body.msg).toEqual("Invalid request body");
    });

    test("Returns 404 status code if user not in the database", async () => {
      const newComment = {
        username: "usernameNotInDatabase",
        body: "this is a test comment",
      };
      const { body } = await request(app)
        .post(`/api/articles/3/comments`)
        .send(newComment)
        .expect(404);
      expect(body.msg).toEqual(
        `username usernameNotInDatabase not found in the database`
      );
    });
  });

  describe("DELETE /api/comments/:comment_id", () => {
    test("Returns 204 status code for a valid comment id that is in the database", async () => {
      const res = await request(app).delete("/api/comments/2").expect(204);
      const { body } = await request(app)
        .get("/api/articles/1/comments")
        .expect(200);
      body.comments.forEach((comment) => {
        expect(comment.comment_id).not.toBe(2);
      });
      const result = await request(app).get("/api/articles/1").expect(200);
      expect(result.body.article.comment_count).toBe(10);
    });

    test("Returns 404 status code for a valid comment id that is not in the database", async () => {
      const res = await request(app).delete("/api/comments/99").expect(404);
      expect(res.body.msg).toBe("comment_id 99 not found in the database");
    });

    test("Returns 400 status code for an invalid comment id", async () => {
      const res = await request(app)
        .delete("/api/comments/notAValidId")
        .expect(400);
      expect(res.body.msg).toBe("Bad request");
    });
  });
});
