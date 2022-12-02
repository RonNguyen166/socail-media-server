import request from "supertest";
import app from "../app.js";
import setupTestDB from "./connect.js";
import { posts, users } from "../data/index.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
setupTestDB();
describe("Post routes", () => {
  describe("POST /posts", () => {
    let user;
    let newPost;
    beforeEach(() => {
      newPost = posts[0];
      user = users[0];
    });
    test("should return 201 create post successful", async () => {
      await User.create(user);
      const credentials = {
        email: user.email,
        password: "Abc123",
      };

      const login = await request(app)
        .post("/auth/login")
        .send(credentials)
        .expect(200);

      const res = await request(app)
        .post("/posts")
        .auth(login.body.token, { type: "bearer" })
        .send({
          userId: login.body.user._id,
          description: newPost.description,
          picturePath: newPost.picturePath,
        })
        .expect(201);

      expect(res.body[0]).toMatchObject({
        userId: login.body.user._id,
        description: newPost.description,
        picturePath: newPost.picturePath,
      });
    });
  });
  describe("GET /posts", () => {
    let user;
    beforeEach(() => {
      user = users[0];
    });
    test("should return 200 get successful", async () => {
      await User.insertMany(users);

      const credentials = {
        email: user.email,
        password: "Abc123",
      };

      const login = await request(app)
        .post("/auth/login")
        .send(credentials)
        .expect(200);
      await Post.insertMany(posts);

      const res = await request(app)
        .get("/posts")
        .auth(login.body.token, { type: "bearer" })
        .expect(200);

      res.body.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      res.body.forEach((e, i) => {
        expect(e).toMatchObject(posts[i]);
      });
    });
  });

  describe("GET /:userId/posts", () => {
    let user;
    beforeEach(() => {
      user = users[0];
    });
    test("should return 200 get successful", async () => {
      await User.insertMany(users);
      await Post.insertMany(posts);
      const credentials = {
        email: user.email,
        password: "Abc123",
      };
      const login = await request(app)
        .post("/auth/login")
        .send(credentials)
        .expect(200);

      await request(app)
        .get(`/posts/${users[1]._id}/posts`)
        .auth(login.body.token, { type: "bearer" })
        .expect(200);
    });
  });

  describe("PATCH /:id/like", () => {
    let user;
    beforeEach(() => {
      user = users[0];
    });
    test("should return 200 Like successful", async () => {
      await User.insertMany(users);
      await Post.insertMany(posts);
      const credentials = {
        email: user.email,
        password: "Abc123",
      };
      const login = await request(app)
        .post("/auth/login")
        .send(credentials)
        .expect(200);

      await request(app)
        .patch(`/posts/${posts[1]._id}/like`)
        .auth(login.body.token, { type: "bearer" })
        .send({ userId: user._id })
        .expect(200);
    });
  });
});
