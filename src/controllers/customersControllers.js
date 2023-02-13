import { connection } from "../database/db.js"

export async function createCustomers(req, res) {
    const { name, phone, cpf, birthday } = req.body;
  
    try {
      await connection.query(
        "INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)",
        [name, phone, cpf, birthday]
      );
  
      res.sendStatus(201);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
  export async function allCustomers(req, res) {
    try {
      const customers = await connection.query('select * from customers')
      res.send(customers.rows)
    } catch (err) {
      res.status(500).send(err.message)
    }
  }

  export async function getById(req, res) {
    const { id } = req.params;
    try {
      const result = await connection.query("SELECT * FROM customers WHERE id = $1",[id]);
  
      if (result.rows === 0) {
        return res.status(404);
      }
  
      res.status(200).send(result.rows[0]);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
  
  export async function putUpdateCustomer(req, res) {
    const { id } = req.params
     const { name, phone, cpf, birthday } = req.body;
   
     try {
       const result = await connection.query(
         "UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5",
         [name, phone, cpf, birthday, id]
       );
   
       if (result.rowCount === 0) {
         return res.status(404).send("Usuario não encontrado");
       }
   
       res.sendStatus(200);
     } catch (err) {
       res.status(500).send(err.message);
     }
   }
   