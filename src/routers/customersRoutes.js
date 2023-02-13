import { Router } from 'express'
import { customersValidate } from '../middlewares/customersValidation.js'
import { allCustomers, createCustomers, getById, putUpdateCustomer } from '../controllers/customersControllers.js'

export const customersRouter = Router()

customersRouter.get('/customers', allCustomers)
customersRouter.post('/customers', customersValidate, createCustomers)
customersRouter.get("/customers/:id", getById);
customersRouter.put('/customers/:id', customersValidate, putUpdateCustomer)

export default customersRouter