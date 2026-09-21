import { useAzure } from '../config/storage.js'

export function health(_req, res) { res.json({ ok: true, storage: useAzure ? 'azure' : 'local-demo' }) }
