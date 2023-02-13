import { rentalsSchema } from "../schemas/rentalsSchema.js";

export async function rentalSchemaValidation(req, res, next) {
  const { customerId, gameId, daysRented } = req.body;

  const rental = {
    customerId,
    gameId,
    daysRented,
  };

  const { error } = rentalsSchema.validate(rental, { abortEarly: false });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).send(errorMessages);
  }

  next();
}