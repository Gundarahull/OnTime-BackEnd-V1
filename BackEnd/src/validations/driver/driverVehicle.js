const validateDriverVehicle = [
  body("vehicle_registration_number")
    .notEmpty()
    .withMessage(" Please send the Vehicle Number"),
  body("vehicle_brand_id")
    .notEmpty()
    .withMessage(" Please send the Vehicle Brand Id"),
  body("vehicle_model_id")
    .notEmpty()
    .withMessage(" Please send the Vehicle Model Id"),
  body("vehicle_variant_id")
    .notEmpty()
    .withMessage(" Please send the Vehicle Variant Id"),
];
