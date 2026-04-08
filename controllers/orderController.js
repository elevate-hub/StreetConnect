const Order = require("../models/Order");
const Vendor = require("../models/Vendor");
const DeliveryPartner = require("../models/DeliveryPartner");

const createOrder = async (req, res, next) => {
  try {
    const { customer, vendorId, items, totalPrice } = req.body;

    if (!customer || !customer.name || !customer.phone || !customer.address) {
      res.status(400);
      throw new Error("customer name, phone, and address are required.");
    }

    if (!vendorId) {
      res.status(400);
      throw new Error("vendorId is required.");
    }

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400);
      throw new Error("items must be a non-empty array.");
    }

    if (totalPrice === undefined || totalPrice === null) {
      res.status(400);
      throw new Error("totalPrice is required.");
    }

    const vendorExists = await Vendor.findById(vendorId);
    if (!vendorExists) {
      res.status(404);
      throw new Error("Vendor not found.");
    }

    const order = await Order.create({
      customer,
      vendor: vendorId,
      items,
      totalPrice: Number(totalPrice),
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      res.status(400);
      throw new Error("status is required.");
    }

    const validStatuses = [
      "pending",
      "accepted",
      "preparing",
      "out_for_delivery",
      "delivered",
    ];

    if (!validStatuses.includes(status)) {
      res.status(400);
      throw new Error(`status must be one of: ${validStatuses.join(", ")}`);
    }

    const order = await Order.findById(id);
    if (!order) {
      res.status(404);
      throw new Error("Order not found.");
    }

    // When vendor accepts the order, auto-assign nearest available delivery partner.
    if (status === "accepted" && !order.deliveryPartner) {
      const vendor = await Vendor.findById(order.vendor);
      if (!vendor) {
        res.status(404);
        throw new Error("Vendor linked to this order was not found.");
      }

      const nearestPartner = await DeliveryPartner.findOne({
        isAvailable: true,
        currentLocation: {
          $near: {
            $geometry: vendor.location,
          },
        },
      });

      if (nearestPartner) {
        order.deliveryPartner = nearestPartner._id;
        nearestPartner.isAvailable = false;
        await nearestPartner.save();
      }
    }

    order.status = status;
    await order.save();

    await order.populate("deliveryPartner", "name phone currentLocation isAvailable");
    res.json(order);
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, updateOrderStatus };
