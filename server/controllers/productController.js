import { ProductModel } from '../models/productModel.js'

export async function listProducts(_req, res) { res.json(await ProductModel.findAll()) }
export async function createProduct(req, res) { res.status(201).json(await ProductModel.create(req.body)) }
export async function updateProduct(req, res) { res.json(await ProductModel.update(req.params.id, req.body)) }
export async function removeProduct(req, res) { await ProductModel.remove(req.params.id); res.status(204).end() }
