import {Router} from "express";
import { createRental, getRentals,postRentalsIdFinish, deleteRentalsId } from "../controllers/rentalControllers.js";
import { rentalSchemaValidation } from  "../middlewares/rentalValidation.js"

export const rentalsRouter = Router();

rentalsRouter.post("/rentals", rentalSchemaValidation, createRental);
rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post('/rentals/:id/return', postRentalsIdFinish);
rentalsRouter.delete('/rentals/:id', deleteRentalsId);

export default rentalsRouter;