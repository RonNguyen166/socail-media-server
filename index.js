import app from "./app.js";
import mongoose from "mongoose";

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose
  .connect(
    process.env.MONGO_URL + (process.env.NODE_ENV === "test" ? "-test" : ""),
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    // /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));
