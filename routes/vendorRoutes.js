const express = require("express");
const {
  registerVendor,
  getNearbyVendors,
} = require("../controllers/vendorController");
const {
  validateBody,
  vendorRegistrationSchema,
} = require("../middleware/validationMiddleware");

const router = express.Router();

router.post("/register", validateBody(vendorRegistrationSchema), registerVendor);
router.get("/nearby", getNearbyVendors);

module.exports = router;
