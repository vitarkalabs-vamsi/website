const express = require("express");
const path = require("path");
const fs = require("fs");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const downloadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { error: "Download limit reached. Please try again later." },
});

const ALLOWED_FILES = {
  "arc-node-blueprint": {
    file: "ARC_Node_v2_Technical_Blueprint.generated.docx",
    name: "ARC_Node_v2_Technical_Blueprint.docx",
    dir: path.join(__dirname, "../../"),
  },
};

router.get("/:key", downloadLimiter, (req, res) => {
  const entry = ALLOWED_FILES[req.params.key];
  if (!entry) {
    return res.status(404).json({ error: "File not found." });
  }

  const filePath = path.join(entry.dir, entry.file);
  if (!fs.existsSync(filePath)) {
    return res.status(503).json({ error: "File is not yet available. Please try again later." });
  }

  console.log(`[DOWNLOAD] ${new Date().toISOString()} | ${req.params.key} | ${req.ip}`);

  res.setHeader("Content-Disposition", `attachment; filename="${entry.name}"`);
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
  res.sendFile(filePath);
});

module.exports = router;
