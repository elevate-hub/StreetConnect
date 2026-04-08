const express = require("express");
const {
  createOrder,
  updateOrderStatus,
} = require("../controllers/orderController");
const {
  validateBody,
  orderCreationSchema,
} = require("../middleware/validationMiddleware");

const router = express.Router();

router.post("/create", validateBody(orderCreationSchema), createOrder);
router.patch("/:id/status", updateOrderStatus);

module.exports = router;
