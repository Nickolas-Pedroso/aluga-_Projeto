import { deleteRecord, listRecords, saveRecord, updateRecord } from '../config/storage.js'
import { tableNames } from '../config/storage.js'

const tableName = tableNames.products
const fallbackKey = 'products'

export const ProductModel = {
  findAll: () => listRecords(tableName, fallbackKey),
  create: (data) => saveRecord(tableName, fallbackKey, data),
  update: (id, data) => updateRecord(tableName, fallbackKey, id, data),
  remove: (id) => deleteRecord(tableName, fallbackKey, id),
}
