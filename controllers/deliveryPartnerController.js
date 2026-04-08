const DeliveryPartner = require("../models/DeliveryPartner");

const registerDeliveryPartner = async (req, res, next) => {
  try {
    const { name, phone, latitude, longitude, isAvailable = true } = req.body;

    if (!name || !phone || latitude === undefined || longitude === undefined) {
      res.status(400);
      throw new Error("name, phone, latitude, and longitude are required.");
    }

    const existing = await DeliveryPartner.findOne({ phone });
    if (existing) {
      res.status(409);
      throw new Error("Delivery partner with this phone already exists.");
    }

    const deliveryPartner = await DeliveryPartner.create({
      name,
      phone,
      currentLocation: {
        type: "Point",
        coordinates: [Number(longitude), Number(latitude)],
      },
      isAvailable,
    });

    res.status(201).json(deliveryPartner);
  } catch (error) {
    next(error);
  }
};

module.exports = { registerDeliveryPartner };
