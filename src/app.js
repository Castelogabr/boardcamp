import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import gamesRouter from "./routers/gamesRoutes.js";
import customersRouter from './routers/customersRoutes.js'
import rentalsRouter from './routers/rentalsRoutes.js'
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(gamesRouter)
app.use(customersRouter)
app.use(rentalsRouter)


const PORT = process.env.PORT
app.listen(PORT, ()=> console.log(`servidor rodando na porta: ${PORT}`))