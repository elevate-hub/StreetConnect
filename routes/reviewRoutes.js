const express = require("express");
const { createReview } = require("../controllers/reviewController");
const {
  validateBody,
  reviewCreationSchema,
} = require("../middleware/validationMiddleware");

const router = express.Router();

router.post("/", validateBody(reviewCreationSchema), createReview);

module.exports = router;
