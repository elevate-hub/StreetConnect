const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    nameEnglish: {
      type: String,
      required: true,
      trim: true,
    },
    nameRegional: {
      type: String,
      default: "",
      trim: true,
    },
    descriptionEnglish: {
      type: String,
      default: "",
      trim: true,
    },
    descriptionRegional: {
      type: String,
      default: "",
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const vendorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    stallType: {
      type: String,
      required: true,
      trim: true,
    },
    menu: [menuItemSchema],
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: (value) => value.length === 2,
          message: "Coordinates must be [longitude, latitude].",
        },
      },
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

vendorSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Vendor", vendorSchema);
