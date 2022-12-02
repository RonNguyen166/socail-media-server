import mongoose from "mongoose";

const setupTestDB = () => {
  beforeAll(async () => {
    mongoose.connect(
      process.env.MONGO_URL + (process.env.NODE_ENV === "test" ? "-test" : ""),
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
  });

  beforeEach(async () => {
    await Promise.all(
      Object.values(mongoose.connection.collections).map(async (collection) =>
        collection.deleteMany()
      )
    );
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
};

export default setupTestDB;
