import { connection } from "../database/db.js"

export async function allGames(req, res) {
  try {
    const games = await connection.query("SELECT * FROM games;");
    res.send(games.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function createGame(req, res) {
  const { name, image, stockTotal, pricePerDay } = req.body;
  try {
    await connection.query(
      `INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1,$2,$3,$4);`,
      [name, image, stockTotal, pricePerDay]
    );
    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}