import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')

// at('public', 'og') -> <project>/public/og
export const at = (...parts) => path.join(root, ...parts)
