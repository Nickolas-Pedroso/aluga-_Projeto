import { app } from './app.js'

import {
  blobContainerName,
  initializeTables,
  tableNames,
  useAzure
} from './config/storage.js'

const port = process.env.PORT || 3001

initializeTables()
  .then(() => {
    app.listen(port, '0.0.0.0', () => {
      console.log(
        `Alugaê API running on port ${port} (${useAzure ? 'Azure Storage' : 'local demo'})`
      )

      if (useAzure) {
        console.log(
          `Azure Tables: ${Object.values(tableNames).join(', ')}`
        )

        console.log(
          `Azure Blob container: ${blobContainerName}`
        )
      }
    })
  })
  .catch((error) => {
    console.error(
      'Azure Storage initialization failed:',
      error.message
    )

    process.exit(1)
  })