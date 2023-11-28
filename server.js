const mongoose = require("mongoose");
const app = require("./app");
const config = require("./utils/config");
mongoose.set("strictQuery", false);
console.log("Connecting to MongoDb...");
mongoose
  .connect(config.URI)
  .then(() => {
    console.log("Connected to MongoDb...");
    app.listen(config.PORT, () => {
      console.log(`Server running on port ${config.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error connecting to MongoDb", error.message);
  });
