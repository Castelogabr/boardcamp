import { connection } from "../database/db.js";

export async function createRental(req, res) {
  const { customerId, gameId, daysRented } = req.body;
  try {
    const gameExist = await connection.query("SELECT * FROM games WHERE id = $1", [
      gameId,
    ]);
    if (gameExist.rowCount !== 1) {
      return res.sendStatus(400);
    }

    const customersExist = await connection.query(
      "SELECT * FROM customers WHERE id = $1",
      [customerId]
    );
    if (customersExist.rowCount !== 1) {
      return res.sendStatus(400);
    }

    const openRentals = await connection.query(
      'SELECT * FROM rentals WHERE "gameId" = $1',
      [gameId]
    );

    const checkStock = await connection.query(
      'SELECT "stockTotal" FROM games WHERE id = $1',
      [gameId]
    );
    if (checkStock.rows[0].stockTotal <= openRentals.rowCount) {
      return res.sendStatus(400);
    }

    const rental = await connection.query(
      `
    INSERT INTO rentals ("customerId", "gameId", "daysRented", "rentDate", "originalPrice")
    VALUES ($1, $2, $3, NOW(), (SELECT "pricePerDay" FROM games WHERE id = $2) * $3);
    `,
      [customerId, gameId, daysRented]
    );

    if (rental.rowCount === 1) {
      res.sendStatus(201);
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function getRentals(req, res) {
  try {
    const rentals = await connection.query(`
    SELECT
      rentals.*,
      json_build_object('id', customers.id, 'name', customers.name) AS customer,
      json_build_object('id', games.id, 'name', games.name) AS game
    FROM
      rentals
      JOIN customers ON rentals."customerId" = customers.id
      JOIN games ON rentals."gameId" = games.id;
    `);
    res.send(rentals.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
}
export async function postRentalsIdFinish(req, res) {
  const { id } = req.params;
  try {
    const rentalResult = await connection.query("SELECT * FROM rentals WHERE id = $1 ", [id])

    const rental = rentalResult.rows[0];
    if (!rental) {
      res.status(404).send("Não encontrado");
      return;
    } if (rental.returnDate) {
      res.status(400).send("Aluguel finalizado");
      return;
    }

    const rentalDate = new Date(rental.rentDate);

    const dueDate = new Date(rentalDate.getTime() + rental.daysRented * 1000 * 60 * 60 * 24);

    const today = new Date();

    const rentalTime = today.getTime() - dueDate.getTime();

    const daysDiff =
      rentalTime > 0 ? Math.floor(rentalTime / (1000 * 60 * 60 * 24)) : 0;

    const feePerDay = Math.floor(rental.originalPrice / rental.daysRented);

    const delayFee = daysDiff ? daysDiff * feePerDay : null;

    await connection.query(
      `
      UPDATE rentals
      SET 
        "returnDate" = Now(),
        "delayFee" = $1
      WHERE 
        id = $2
    `,
      [delayFee, id]
    );

    return res.sendStatus(200)
  } catch (err) {
    return res.status(500).send(err);
  }
}

export async function deleteRentalsId(req, res) {
  const { id } = req.params;
  try {
    const rentalDetail = await connection.query("SELECT * FROM rentals WHERE id = $1", [
      id,
    ]);
    if (rentalDetail.rowCount < 1) return res.status(404).send("Não encontrado");
    if (!rentalDetail.rows[0].returnDate)
      return res.status(400).send("Aluguel não finalizado");

    await connection.query("DELETE FROM rentals WHERE id = $1", [id]);
    return res.status(200).send("Excluido com sucesso");
  } catch (err) {
    return res.status(500).send(err);
  }
}