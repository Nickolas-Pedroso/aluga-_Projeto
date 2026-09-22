import { listRecords, saveRecord } from '../config/storage.js'
import { tableNames } from '../config/storage.js'

const tableName = tableNames.orders
const fallbackKey = 'orders'

export const OrderModel = {
  findAll: () => listRecords(tableName, fallbackKey),
  create: (data) => {
    const { client, email, delivery, address, payment, total, items, status } = data
    return saveRecord(tableName, fallbackKey, {
      client: String(client),
      email: String(email),
      delivery: String(delivery),
      address: String(address || ''),
      payment: String(payment),
      total: Number(total),
      itemsJson: JSON.stringify(items || []),
      itemCount: Array.isArray(items) ? items.length : 0,
      status: String(status || 'pending'),
    })
  },
}
