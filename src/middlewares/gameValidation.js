import { connection } from "../database/db.js";

export async function gameValidate(req, res, next) {
  const { name } = req.body;
  try {
    const game = await connection.query(`SELECT * FROM games WHERE name = $1`, [name]);
    if (game.rowCount) return res.sendStatus(409);
    next();
  } catch (error) {
    res.status(500).send(error.message);
  }
}