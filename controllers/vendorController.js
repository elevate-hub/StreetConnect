const Vendor = require("../models/Vendor");

const registerVendor = async (req, res, next) => {
  try {
    const { name, stallType, menu = [], latitude, longitude, isOnline = false } = req.body;

    if (!name || !stallType || latitude === undefined || longitude === undefined) {
      res.status(400);
      throw new Error("name, stallType, latitude, and longitude are required.");
    }

    const vendor = await Vendor.create({
      name,
      stallType,
      menu,
      location: {
        type: "Point",
        coordinates: [Number(longitude), Number(latitude)],
      },
      isOnline,
    });

    res.status(201).json(vendor);
  } catch (error) {
    next(error);
  }
};

const getNearbyVendors = async (req, res, next) => {
  try {
    const { lat, lng } = req.query;

    if (lat === undefined || lng === undefined) {
      res.status(400);
      throw new Error("lat and lng query parameters are required.");
    }

    const vendors = await Vendor.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [Number(lng), Number(lat)],
          },
          $maxDistance: 5000,
        },
      },
      isOnline: true,
    });

    res.json(vendors);
  } catch (error) {
    next(error);
  }
};

module.exports = { registerVendor, getNearbyVendors };
