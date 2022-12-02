import request from "supertest";
import app from "../app.js";
import setupTestDB from "./connect.js";
import { users } from "../data/index.js";
import User from "../models/User.js";
setupTestDB();
describe("Auth routes", () => {
  describe("POST /auth/register", () => {
    let newUser;
    beforeEach(() => {
      newUser = {
        ...users[0],
        password: "Abc123",
      };
    });

    test("should return 201 and successfully register user if request data is ok", async () => {
      const res = await request(app)
        .post("/auth/register")
        .send(newUser)
        .expect(201);
      expect(res.body).toMatchObject({
        _id: expect.anything(),
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      });
    });
  });

  describe("POST /auth/login", () => {
    let newUser;
    beforeEach(() => {
      newUser = users[1];
    });
    test("should return 200 and login user if email and password match", async () => {
      await User.create(newUser);

      const credentials = {
        email: newUser.email,
        password: "Abc123",
      };

      const res = await request(app)
        .post("/auth/login")
        .send(credentials)
        .expect(200);

      expect(res.body.user).toMatchObject({
        _id: expect.anything(),
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      });

      expect(res.body.token).toEqual(expect.anything());
    });
  });
});
