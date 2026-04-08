require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Order = require("../models/Order");
const DeliveryPartner = require("../models/DeliveryPartner");

const STEP_FACTOR = 0.12; // Move 12% closer on each tick.
const TICK_MS = 3000;
const ARRIVAL_THRESHOLD = 0.00015;

const closeConnection = async (code = 0) => {
  await mongoose.connection.close();
  process.exit(code);
};

const simulateMovement = async () => {
  try {
    await connectDB();

    const assignedOrder = await Order.findOne({
      deliveryPartner: { $ne: null },
      status: { $in: ["accepted", "preparing", "out_for_delivery"] },
    })
      .populate("vendor", "location name")
      .populate("deliveryPartner", "name currentLocation isAvailable");

    if (!assignedOrder) {
      console.log("No assigned in-progress order found for movement simulation.");
      return closeConnection(0);
    }

    const partner = await DeliveryPartner.findById(assignedOrder.deliveryPartner._id);
    if (!partner) {
      console.log("Assigned delivery partner no longer exists.");
      return closeConnection(1);
    }

    const [targetLng, targetLat] = assignedOrder.vendor.location.coordinates;
    console.log(
      `Simulating movement for ${partner.name} toward vendor ${assignedOrder.vendor.name}.`
    );

    const intervalId = setInterval(async () => {
      try {
        const [currentLng, currentLat] = partner.currentLocation.coordinates;

        const deltaLng = targetLng - currentLng;
        const deltaLat = targetLat - currentLat;
        const distance = Math.sqrt(deltaLng * deltaLng + deltaLat * deltaLat);

        if (distance <= ARRIVAL_THRESHOLD) {
          partner.currentLocation.coordinates = [targetLng, targetLat];
          await partner.save();
          console.log("Partner reached vendor location. Simulation complete.");
          clearInterval(intervalId);
          return closeConnection(0);
        }

        const nextLng = currentLng + deltaLng * STEP_FACTOR;
        const nextLat = currentLat + deltaLat * STEP_FACTOR;

        partner.currentLocation.coordinates = [nextLng, nextLat];
        await partner.save();

        console.log(
          `Moved to [${nextLat.toFixed(6)}, ${nextLng.toFixed(6)}], remaining: ${distance.toFixed(
            6
          )}`
        );
      } catch (tickError) {
        console.error("Simulation tick failed:", tickError.message);
        clearInterval(intervalId);
        return closeConnection(1);
      }
    }, TICK_MS);
  } catch (error) {
    console.error("Failed to start movement simulation:", error.message);
    await closeConnection(1);
  }
};

simulateMovement();

process.on("SIGINT", async () => {
  await closeConnection(0);
});
