import { BlobSASPermissions, generateBlobSASQueryParameters } from '@azure/storage-blob'
import { blobContainerName, blobCredential, blobService, storageAccountName, useAzure } from '../config/storage.js'

async function saveBlob({ fileName, contentType, buffer }) {
  if (!useAzure) return { url: `data:${contentType || 'image/jpeg'};base64,${buffer.toString('base64')}`, storage: 'local-demo' }
  const container = blobService().getContainerClient(blobContainerName)
  await container.createIfNotExists()
  const blob = container.getBlockBlobClient(fileName)
  await blob.uploadData(buffer, { blobHTTPHeaders: { blobContentType: contentType || 'image/jpeg' } })
  const credential = blobCredential()
  if (!credential || !storageAccountName) return { url: blob.url, storage: 'azure-blob' }
  const startsOn = new Date()
  const expiresOn = new Date(startsOn.getTime() + 24 * 60 * 60 * 1000)
  const sas = generateBlobSASQueryParameters({ containerName: blobContainerName, blobName: blob.name, permissions: BlobSASPermissions.parse('r'), startsOn, expiresOn }, credential).toString()
  return { url: `${blob.url}?${sas}`, storage: 'azure-blob', expiresAt: expiresOn.toISOString() }
}

export async function uploadProductImage({ fileName, contentType, data }) {
  return saveBlob({ fileName: `${Date.now()}-${fileName}`, contentType, buffer: Buffer.from(data, 'base64') })
}

export async function uploadRemoteImage({ sourceUrl, fileName }) {
  const response = await fetch(sourceUrl)
  if (!response.ok) throw new Error(`Imagem remota indisponível: ${response.status}`)
  return saveBlob({ fileName, contentType: response.headers.get('content-type') || 'image/jpeg', buffer: Buffer.from(await response.arrayBuffer()) })
}
