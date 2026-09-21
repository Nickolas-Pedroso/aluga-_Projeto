import { uploadProductImage, uploadRemoteImage } from '../models/uploadModel.js'

export async function uploadImage(req, res) {
  const { fileName, contentType, data } = req.body
  if (!fileName || !data) return res.status(400).json({ error: 'fileName e data são obrigatórios' })
  res.status(201).json(await uploadProductImage({ fileName, contentType, data }))
}

export async function uploadRemote(req, res) {
  const { sourceUrl, fileName } = req.body
  if (!sourceUrl || !fileName) return res.status(400).json({ error: 'sourceUrl e fileName são obrigatórios' })
  res.status(201).json(await uploadRemoteImage({ sourceUrl, fileName }))
}
