const Joi = require("joi");

const vendorRegistrationSchema = Joi.object({
  name: Joi.string().trim().min(2).required(),
  stallType: Joi.string().trim().min(2).required(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  isOnline: Joi.boolean().optional(),
  menu: Joi.array()
    .items(
      Joi.object({
        nameEnglish: Joi.string().trim().required(),
        nameRegional: Joi.string().allow("").optional(),
        descriptionEnglish: Joi.string().allow("").optional(),
        descriptionRegional: Joi.string().allow("").optional(),
        price: Joi.number().min(0).required(),
        isAvailable: Joi.boolean().optional(),
      })
    )
    .optional(),
});

const orderCreationSchema = Joi.object({
  customer: Joi.object({
    name: Joi.string().trim().required(),
    phone: Joi.string().trim().required(),
    address: Joi.string().trim().required(),
  }).required(),
  vendorId: Joi.string().trim().required(),
  items: Joi.array()
    .items(
      Joi.object({
        itemName: Joi.string().trim().required(),
        quantity: Joi.number().integer().min(1).required(),
        price: Joi.number().min(0).required(),
      })
    )
    .min(1)
    .required(),
  totalPrice: Joi.number().min(0).required(),
});

const reviewCreationSchema = Joi.object({
  targetId: Joi.string().trim().required(),
  targetType: Joi.string().valid("Vendor", "Partner").required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().allow("").optional(),
  customerId: Joi.string().trim().required(),
});

const validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: "Validation failed",
      details: error.details.map((detail) => detail.message),
    });
  }
  return next();
};

module.exports = {
  validateBody,
  vendorRegistrationSchema,
  orderCreationSchema,
  reviewCreationSchema,
};
