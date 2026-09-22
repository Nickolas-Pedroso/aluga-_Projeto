import { OrderModel } from '../models/orderModel.js'

export async function listOrders(_req, res) { res.json(await OrderModel.findAll()) }
export async function createOrder(req, res) {
	const { client, email, items, total, payment, delivery } = req.body
	if (!client || !email || !Array.isArray(items) || !Number.isFinite(Number(total)) || !payment || !delivery) {
		return res.status(400).json({ error: 'Pedido incompleto: cliente, e-mail, itens, total, pagamento e entrega são obrigatórios.' })
	}
	try {
		res.status(201).json(await OrderModel.create(req.body))
	} catch (error) {
		console.error('Order storage error:', { message: error?.message, code: error?.code, statusCode: error?.statusCode, details: error?.details })
		res.status(500).json({ error: 'Falha ao salvar pedido no Azure Table Storage.', code: error?.code || 'ORDER_STORAGE_ERROR' })
	}
}
