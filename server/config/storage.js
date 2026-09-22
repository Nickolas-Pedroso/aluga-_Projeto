import { TableClient } from '@azure/data-tables'
import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob'
import { randomUUID } from 'node:crypto'

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING
export const storageAccountName = connectionString?.match(/AccountName=([^;]+)/)?.[1]
export const storageAccountKey = connectionString?.match(/AccountKey=([^;]+)/)?.[1]
export const useAzure = Boolean(connectionString)
export const localData = { products: [], clients: [], orders: [] }
export const tableNames = {
  products: 'NickolasProdutos',
  clients: 'NickolasClientes',
  orders: 'NickolasPedidos',
}
export const blobContainerName = 'nickolaspedidos-imagens'

export function tableClient(tableName) {
  return TableClient.fromConnectionString(connectionString, tableName)
}

export function blobService() {
  return BlobServiceClient.fromConnectionString(connectionString)
}

export function blobCredential() {
  if (!storageAccountName || !storageAccountKey) return undefined
  return new StorageSharedKeyCredential(storageAccountName, storageAccountKey)
}

function azureSafeRecord(record) {
  return Object.fromEntries(Object.entries(record).map(([key, value]) => [
    key,
    value !== null && typeof value === 'object' ? JSON.stringify(value) : value,
  ]))
}

export async function initializeTables() {
  if (!useAzure) return
  await Promise.all(Object.values(tableNames).map(async (name) => {
    try {
      await tableClient(name).createTable()
    } catch (error) {
      if (error.statusCode !== 409) throw error
    }
  }))
  await blobService().getContainerClient(blobContainerName).createIfNotExists()
}

export async function listRecords(tableName, fallbackKey) {
  if (!useAzure) return localData[fallbackKey]
  const records = []
  for await (const entity of tableClient(tableName).listEntities()) records.push(entity)
  return records
}

export async function saveRecord(tableName, fallbackKey, record) {
  const withId = { ...record, id: record.id || randomUUID(), createdAt: record.createdAt || new Date().toISOString() }
  if (!useAzure) {
    localData[fallbackKey].push(withId)
    return withId
  }
  const entity = { partitionKey: 'default', rowKey: String(withId.id), ...azureSafeRecord(withId) }
  await tableClient(tableName).upsertEntity(entity, 'Replace')
  return entity
}

export async function updateRecord(tableName, fallbackKey, id, record) {
  if (!useAzure) {
    localData[fallbackKey] = localData[fallbackKey].map((item) => item.id === id ? { ...item, ...record, id } : item)
    return localData[fallbackKey].find((item) => item.id === id)
  }
  const entity = { partitionKey: 'default', rowKey: String(id), ...azureSafeRecord({ ...record, id }) }
  await tableClient(tableName).upsertEntity(entity, 'Merge')
  return entity
}

export async function deleteRecord(tableName, fallbackKey, id) {
  if (!useAzure) {
    localData[fallbackKey] = localData[fallbackKey].filter((item) => item.id !== id)
    return
  }
  await tableClient(tableName).deleteEntity('default', String(id))
}
