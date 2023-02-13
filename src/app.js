import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import gamesRouter from "./routers/gamesRoutes.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(gamesRouter)

const PORT = process.env.PORT
app.listen(PORT, ()=> console.log(`servidor rodando na porta: ${PORT}`))