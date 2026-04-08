require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Vendor = require("../models/Vendor");
const DeliveryPartner = require("../models/DeliveryPartner");
const Review = require("../models/Review");
const { recalculateTargetRating } = require("../controllers/reviewController");

const vendorData = [
  {
    name: "Raju's Vada Pav",
    stallType: "Maharashtrian Snacks",
    location: { type: "Point", coordinates: [72.8265, 19.1075] },
    isOnline: true,
    menu: [
      {
        nameEnglish: "Vada Pav",
        nameRegional: "Vada Pav",
        descriptionEnglish: "Spiced potato fritter in pav bread.",
        descriptionRegional: "Masaledar batata vada pav bread me.",
        price: 25,
        isAvailable: true,
      },
      {
        nameEnglish: "Mirchi Bhajji",
        nameRegional: "Mirchi Bhaji",
        descriptionEnglish: "Fried green chili fritter.",
        descriptionRegional: "Tali hui hari mirch bhaji.",
        price: 20,
        isAvailable: true,
      },
    ],
  },
  {
    name: "Sai Sandwich",
    stallType: "Sandwiches",
    location: { type: "Point", coordinates: [72.8354, 19.1163] },
    isOnline: true,
    menu: [
      {
        nameEnglish: "Veg Grilled Sandwich",
        nameRegional: "Veg Grilled Sandwich",
        descriptionEnglish: "Loaded grilled sandwich with chutneys.",
        descriptionRegional: "Chutney ke sath grilled sandwich.",
        price: 70,
        isAvailable: true,
      },
      {
        nameEnglish: "Cheese Toast Sandwich",
        nameRegional: "Cheese Toast Sandwich",
        descriptionEnglish: "Toasted sandwich with melted cheese.",
        descriptionRegional: "Pighle cheese wala toasted sandwich.",
        price: 85,
        isAvailable: true,
      },
    ],
  },
  {
    name: "Meera Dosa Hub",
    stallType: "South Indian",
    location: { type: "Point", coordinates: [72.8502, 19.1049] },
    isOnline: true,
    menu: [
      {
        nameEnglish: "Masala Dosa",
        nameRegional: "Masala Dosa",
        descriptionEnglish: "Crispy dosa with potato filling.",
        descriptionRegional: "Aloo bharav wala crispy dosa.",
        price: 80,
        isAvailable: true,
      },
      {
        nameEnglish: "Medu Vada",
        nameRegional: "Medu Vada",
        descriptionEnglish: "Crispy vada with coconut chutney.",
        descriptionRegional: "Nariyal chutney ke sath crispy vada.",
        price: 55,
        isAvailable: true,
      },
    ],
  },
  {
    name: "Bhaiyya Chaat Corner",
    stallType: "Chaat",
    location: { type: "Point", coordinates: [72.8421, 19.0912] },
    isOnline: true,
    menu: [
      {
        nameEnglish: "Sev Puri",
        nameRegional: "Sev Puri",
        descriptionEnglish: "Crunchy puris topped with sev and chutney.",
        descriptionRegional: "Sev aur chutney wali kurkuri puri.",
        price: 45,
        isAvailable: true,
      },
      {
        nameEnglish: "Pani Puri",
        nameRegional: "Pani Puri",
        descriptionEnglish: "Puffed puris with spicy and tangy water.",
        descriptionRegional: "Chatpata pani ke sath pani puri.",
        price: 35,
        isAvailable: true,
      },
    ],
  },
  {
    name: "Annapurna Idli Stall",
    stallType: "South Indian Breakfast",
    location: { type: "Point", coordinates: [72.8296, 19.0971] },
    isOnline: true,
    menu: [
      {
        nameEnglish: "Idli Sambar",
        nameRegional: "Idli Sambar",
        descriptionEnglish: "Steamed idli served with hot sambar.",
        descriptionRegional: "Garam sambar ke sath naram idli.",
        price: 60,
        isAvailable: true,
      },
      {
        nameEnglish: "Upma",
        nameRegional: "Upma",
        descriptionEnglish: "Savory semolina breakfast bowl.",
        descriptionRegional: "Sooji ka namkeen upma.",
        price: 50,
        isAvailable: true,
      },
    ],
  },
];

const deliveryPartnerData = [
  {
    name: "Arjun Patil",
    phone: "9000000001",
    currentLocation: { type: "Point", coordinates: [72.8422, 19.0322] },
    isAvailable: true,
  },
  {
    name: "Riya Shaikh",
    phone: "9000000002",
    currentLocation: { type: "Point", coordinates: [72.8551, 19.076] },
    isAvailable: true,
  },
  {
    name: "Sameer Khan",
    phone: "9000000003",
    currentLocation: { type: "Point", coordinates: [72.8218, 19.1012] },
    isAvailable: true,
  },
];

const reviewTemplates = [
  { rating: 5, comment: "Excellent taste and quick prep!" },
  { rating: 4, comment: "Very good food, decent packaging." },
  { rating: 5, comment: "Authentic flavor and fresh ingredients." },
  { rating: 4, comment: "Good quality and portion size." },
  { rating: 5, comment: "Loved it, will order again." },
  { rating: 4, comment: "Tasty and affordable." },
  { rating: 5, comment: "Perfect street food experience." },
  { rating: 4, comment: "Hot and fresh delivery handoff." },
  { rating: 5, comment: "Amazing snacks and hygiene." },
  { rating: 4, comment: "Great value and flavor." },
];

const seedData = async () => {
  try {
    await connectDB();

    await Vendor.deleteMany({});
    await DeliveryPartner.deleteMany({});
    await Review.deleteMany({});

    const vendors = await Vendor.insertMany(vendorData);
    const partners = await DeliveryPartner.insertMany(deliveryPartnerData);
    const reviews = [];

    for (let i = 0; i < reviewTemplates.length; i += 1) {
      const vendor = vendors[i % vendors.length];
      reviews.push({
        targetId: vendor._id,
        targetType: "Vendor",
        rating: reviewTemplates[i].rating,
        comment: reviewTemplates[i].comment,
        customerId: `customer_${i + 1}`,
      });
    }

    const insertedReviews = await Review.insertMany(reviews);

    await Promise.all(
      vendors.map((vendor) => recalculateTargetRating(vendor._id, "Vendor"))
    );

    console.log(
      `Seed complete: ${vendors.length} vendors, ${partners.length} partners, ${insertedReviews.length} reviews.`
    );
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

seedData();

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});
