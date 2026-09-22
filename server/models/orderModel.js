import { listRecords, saveRecord } from '../config/storage.js'
import { tableNames } from '../config/storage.js'

const tableName = tableNames.orders
const fallbackKey = 'orders'

export const OrderModel = {
  findAll: () => listRecords(tableName, fallbackKey),
  create: (data) => {
    const { items, ...order } = data
    return saveRecord(tableName, fallbackKey, {
      ...order,
      itemsJson: JSON.stringify(items || []),
      itemCount: Array.isArray(items) ? items.length : 0,
      status: data.status || 'pending',
    })
  },
}
