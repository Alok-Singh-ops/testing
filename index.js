const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser"); // Middleware for parsing JSON

const port = process.env.PORT || 8080;

const conn_str =
  "mongodb+srv://alokshivsingh:bzyJmLmSCjKIOtzF@cluster0.ke2pqeu.mongodb.net/?retryWrites=true&w=majority";

// Connect to MongoDB using async/await
async function connectToDatabase() {
  try {
    await mongoose.connect(conn_str, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB is connected");
  } catch (error) {
    console.error("Error in connection:", error);
  }
}

connectToDatabase();

// Middleware for parsing JSON
app.use(bodyParser.json());

// Define a Mongoose schema for your data (e.g., a User schema)
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

// Create a Mongoose model based on the schema
const User = mongoose.model("User", userSchema);

// Create a POST endpoint to add data to the database

app.get("/", async (req, res) => {
  try {
    // Query the database to retrieve all users
    const users = await User.find();

    // Respond with the list of users
    res.json(users);
  } catch (error) {
    console.error("Error while fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const { name, email } = req.body;

    // Create a new user document
    const newUser = new User({ name, email });
    await newUser.save();
    res.send("New user added"); // Respond with the newly created user
  } catch (error) {
    console.error("Error while creating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log("Server is running on port " + port);
});
