import { deleteRecord, listRecords, saveRecord, updateRecord } from '../config/storage.js'
import { tableNames } from '../config/storage.js'

const tableName = tableNames.clients
const fallbackKey = 'clients'

export const ClientModel = {
  findAll: () => listRecords(tableName, fallbackKey),
  create: (data) => saveRecord(tableName, fallbackKey, {
    name: String(data.name),
    email: String(data.email).toLowerCase(),
    phone: String(data.phone || ''),
    cpf: String(data.cpf || ''),
    address: String(data.address || ''),
    password: String(data.password || ''),
    role: data.role === 'admin' ? 'admin' : 'customer',
    rentals: Number.isFinite(Number(data.rentals)) ? Number(data.rentals) : 0,
  }),
  update: (id, data) => updateRecord(tableName, fallbackKey, id, {
    name: String(data.name),
    email: String(data.email).toLowerCase(),
    phone: String(data.phone || ''),
    cpf: String(data.cpf || ''),
    address: String(data.address || ''),
    ...(data.password ? { password: String(data.password) } : {}),
    role: data.role === 'admin' ? 'admin' : 'customer',
    rentals: Number.isFinite(Number(data.rentals)) ? Number(data.rentals) : 0,
  }),
  remove: (id) => deleteRecord(tableName, fallbackKey, id),
}
