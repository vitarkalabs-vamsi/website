const express = require("express");
const cors = require("cors");
const path = require("path");

const contactRouter  = require("./routes/contact");
const downloadRouter = require("./routes/download");

const app = express();
const PORT = process.env.PORT || 3001;

const ALLOWED_ORIGINS = [
  "http://localhost:4173",
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    cb(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: false }));

app.get("/health", (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

app.use("/api/contact",  contactRouter);
app.use("/api/download", downloadRouter);

app.use((err, _req, res, _next) => {
  console.error("[ERROR]", err.message);
  res.status(500).json({ error: "Internal server error." });
});

app.listen(PORT, () => {
  console.log(`Vitarka Labs API running on http://localhost:${PORT}`);
});
