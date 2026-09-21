import { listRecords, saveRecord } from '../config/storage.js'
import { tableNames } from '../config/storage.js'

const tableName = tableNames.orders
const fallbackKey = 'orders'

export const OrderModel = {
  findAll: () => listRecords(tableName, fallbackKey),
  create: (data) => saveRecord(tableName, fallbackKey, { ...data, status: data.status || 'pending' }),
}
