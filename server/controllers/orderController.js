import { OrderModel } from '../models/orderModel.js'

export async function listOrders(_req, res) { res.json(await OrderModel.findAll()) }
export async function createOrder(req, res) { res.status(201).json(await OrderModel.create(req.body)) }
