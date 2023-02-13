import { customersSchema } from "../schemas/customersSchema.js";
import { connection } from "../database/db.js";

export async function customersValidate(req, res, next) {
    const validation = req.body;
    const { id } = req.params

    const { err } = customersSchema.validate(validation, { abortEarly: false })

    if (err) {
        const err = err.details.map(detail => detail.message)
        return res.status(400).send(err)
    }

    const cpfCustomerExists = await connection.query(
        "SELECT * FROM customers WHERE cpf=$1",
        [validation.cpf]
      );
    
      if (
        cpfCustomerExists.rowCount !== 0 &&
        cpfCustomerExists.rows[0].id !== Number(id)
      ) {
        return res.sendStatus(409);
      }
    next();
}