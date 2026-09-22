import { ClientModel } from '../models/clientModel.js'

export async function listClients(_req, res) { res.json(await ClientModel.findAll()) }
export async function createClient(req, res) {
	if (!req.body?.name || !req.body?.email) return res.status(400).json({ error: 'Nome e e-mail são obrigatórios.' })
	try {
		res.status(201).json(await ClientModel.create(req.body))
	} catch (error) {
		console.error('Client storage error:', { message: error?.message, code: error?.code, statusCode: error?.statusCode, details: error?.details })
		res.status(500).json({ error: 'Falha ao salvar cliente no Azure Table Storage.', code: error?.code || 'CLIENT_STORAGE_ERROR' })
	}
}
export async function updateClient(req, res) { res.json(await ClientModel.update(req.params.id, req.body)) }
export async function removeClient(req, res) { await ClientModel.remove(req.params.id); res.status(204).end() }
