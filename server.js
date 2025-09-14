const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 8080;
const host = "0.0.0.0";

// Serve static files from the root (adjust to 'public' or 'dist' if needed)
app.use(express.static(path.join(__dirname)));

// Fallback to index.html for any route
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, host, () => {
  console.log(`Server is listening on port http://${host}:${port}`);
});
