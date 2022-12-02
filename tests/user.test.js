import request from "supertest";
import app from "../app.js";
import setupTestDB from "./connect.js";
import { users } from "../data/index.js";
import User from "../models/User.js";
setupTestDB();
describe("User routes", () => {
  describe("GET /users/:id", () => {
    let newUser;
    beforeEach(() => {
      newUser = users[1];
    });
    test("should return 200 get user", async () => {
      await User.insertMany(users);

      const credentials = {
        email: newUser.email,
        password: "Abc123",
      };

      const login = await request(app)
        .post("/auth/login")
        .send(credentials)
        .expect(200);

      await request(app)
        .get(`/users/${users[1]._id}`)
        .auth(login.body.token, { type: "bearer" })
        .expect(200);
    });
  });
  describe("GET /users/:id/friend", () => {
    let newUser;
    beforeEach(() => {
      newUser = users[1];
    });
    test("should return 200 get friends", async () => {
      await User.insertMany(users);

      const credentials = {
        email: newUser.email,
        password: "Abc123",
      };

      const login = await request(app)
        .post("/auth/login")
        .send(credentials)
        .expect(200);

      await request(app)
        .get(`/users/${users[1]._id}/friends`)
        .auth(login.body.token, { type: "bearer" })
        .expect(200);
    });
  });

  describe("PATCH /users/:id/:friendId", () => {
    let newUser;
    beforeEach(() => {
      newUser = users[1];
    });
    test("should return 200 add/remove friends", async () => {
      await User.insertMany(users);

      const credentials = {
        email: newUser.email,
        password: "Abc123",
      };

      const login = await request(app)
        .post("/auth/login")
        .send(credentials)
        .expect(200);

      const res = await request(app)
        .patch(`/users/${users[1]._id}/${users[2]._id}`)
        .auth(login.body.token, { type: "bearer" })
        .expect(200);
      expect(res.body[0]).toMatchObject({
        _id: users[2]._id,
        firstName: users[2].firstName,
        lastName: users[2].lastName,
        occupation: users[2].occupation,
        location: users[2].location,
        picturePath: users[2].picturePath,
      });
    });
  });
});
