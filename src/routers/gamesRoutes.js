import { Router } from 'express'
import { createGame, allGames } from '../controllers/gameControllers.js'
import { gameValidate } from '../middlewares/gameValidation.js'

export const gamesRouter = Router();

gamesRouter.get('/games', allGames)
gamesRouter.post('/games', gameValidate, createGame)

export default gamesRouter
