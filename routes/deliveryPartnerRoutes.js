const express = require("express");
const {
  registerDeliveryPartner,
} = require("../controllers/deliveryPartnerController");

const router = express.Router();

router.post("/register", registerDeliveryPartner);

module.exports = router;
