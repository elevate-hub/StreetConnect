const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    targetType: {
      type: String,
      enum: ["Vendor", "Partner"],
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      default: "",
    },
    customerId: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

reviewSchema.index({ targetId: 1, targetType: 1 });

module.exports = mongoose.model("Review", reviewSchema);
