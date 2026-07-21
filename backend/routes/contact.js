const express = require("express");
const { body, validationResult } = require("express-validator");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Too many contact requests. Please try again in 15 minutes." },
});

const validate = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 120 }),
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("message").trim().notEmpty().withMessage("Message is required").isLength({ min: 10, max: 2000 }),
  body("type").optional().isIn(["software", "ai", "embedded", "iot", "arcnode", "organoid", "other"]),
];

router.post("/", contactLimiter, validate, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { name, email, message, type = "other" } = req.body;

  // In production: send via nodemailer. For now, log and confirm.
  console.log(`[CONTACT] ${new Date().toISOString()} | ${type} | ${name} <${email}>`);
  console.log(`[CONTACT] Message: ${message.slice(0, 120)}…`);

  return res.status(200).json({
    ok: true,
    message: "Your message has been received. We will respond shortly.",
  });
});

module.exports = router;
