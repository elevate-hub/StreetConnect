const mongoose = require("mongoose");
const Review = require("../models/Review");
const Vendor = require("../models/Vendor");
const DeliveryPartner = require("../models/DeliveryPartner");

const getTargetModel = (targetType) => (targetType === "Vendor" ? Vendor : DeliveryPartner);

const recalculateTargetRating = async (targetId, targetType) => {
  const targetModel = getTargetModel(targetType);
  const objectId = new mongoose.Types.ObjectId(targetId);

  const [stats] = await Review.aggregate([
    {
      $match: {
        targetId: objectId,
        targetType,
      },
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  const averageRating = stats ? Number(stats.averageRating.toFixed(2)) : 0;
  const totalReviews = stats ? stats.totalReviews : 0;

  await targetModel.findByIdAndUpdate(targetId, { averageRating, totalReviews });
};

const createReview = async (req, res, next) => {
  try {
    const { targetId, targetType, rating, comment = "", customerId } = req.body;
    const targetModel = getTargetModel(targetType);

    const target = await targetModel.findById(targetId);
    if (!target) {
      res.status(404);
      throw new Error(`${targetType} not found.`);
    }

    const review = await Review.create({
      targetId,
      targetType,
      rating,
      comment,
      customerId,
    });

    await recalculateTargetRating(targetId, targetType);

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

module.exports = { createReview, recalculateTargetRating };
