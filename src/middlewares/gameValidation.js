import { gameSchema } from "../schemas/gameSchema.js";
import { connection } from "../database/db.js";

export async function gameValidate(req, res, next) {
    const validation = req.body;

    const { err } = gameSchema.validate(validation, { abortEarly: false })

    if (err) {
        const err = err.details.map(detail => detail.message);
        return res.status(400).send(err)
    }

    const gameExist = await connection.query(`SELECT name FROM games WHERE  name = $1`, [validation.name])
    if (gameExist.rows[0]) return res.status(409).send("Jogo já cadastrado");

    next();
} 