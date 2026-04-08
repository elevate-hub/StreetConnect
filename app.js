require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const vendorRoutes = require("./routes/vendorRoutes");
const orderRoutes = require("./routes/orderRoutes");
const deliveryPartnerRoutes = require("./routes/deliveryPartnerRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ message: "StreetConnect backend is running" });
});

app.use("/api/vendors", vendorRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/delivery-partners", deliveryPartnerRoutes);
app.use("/api/reviews", reviewRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
