import { ClientModel } from '../models/clientModel.js'

export async function listClients(_req, res) { res.json(await ClientModel.findAll()) }
export async function createClient(req, res) { res.status(201).json(await ClientModel.create(req.body)) }
export async function updateClient(req, res) { res.json(await ClientModel.update(req.params.id, req.body)) }
export async function removeClient(req, res) { await ClientModel.remove(req.params.id); res.status(204).end() }
