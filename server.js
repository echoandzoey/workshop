const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static("./"));

// Endpoint to save reflections
app.post("/save-reflection", (req, res) => {
  const { participantName, reflection } = req.body;

  if (!participantName || !reflection) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Create reflections directory if it doesn't exist
  const reflectionsDir = path.join(__dirname, "reflections");
  if (!fs.existsSync(reflectionsDir)) {
    fs.mkdirSync(reflectionsDir);
  }

  // Save reflection to a file
  const fileName = `${participantName}_${Date.now()}.txt`;
  const filePath = path.join(reflectionsDir, fileName);

  fs.writeFile(filePath, reflection, (err) => {
    if (err) {
      console.error("Error saving reflection:", err);
      return res.status(500).json({ error: "Failed to save reflection" });
    }

    res
      .status(200)
      .json({ success: true, message: "Reflection saved successfully" });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
