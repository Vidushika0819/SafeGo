const express = require("express");
require("dotenv").config();
 
const app = express();
app.use(express.json());
 
// Routes
app.get("/", (req, res) => {
  res.send("API is working... 🚀");
});
 
// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));