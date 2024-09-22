const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const contractInteractions = require("./routes/contractInteractions");
const mongoose = require("mongoose");
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// lol706515
// 04aPXayJ2FNIvztY
// Routes
app.use("/api", contractInteractions);

const PORT = process.env.PORT || 3001;

mongoose
  .connect(
    "mongodb+srv://lol706515:04aPXayJ2FNIvztY@cluster0test.fdfq8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0test",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 50, // Increase the pool size
      wtimeoutMS: 2500,
    }
  )
  .then((t) => {
    console.log("Connected to MongoDB");
  });
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
