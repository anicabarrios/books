// Makes the small WebP copies of every cover in public/covers/ (run: npm run covers).
// It also runs before every `npm run dev` and `npm run build`, and skips copies that are already
// up to date, so a new cover can never go live without its small versions.
//
//   public/covers/my_book.jpg   <- you put this one here (the big original)
//   public/covers/my_book-320.webp, my_book-480.webp, my_book-720.webp   <- made for you
//
// Phones download a 20 KB copy instead of the 170 KB original, so the page loads faster.
import sharp from 'sharp'
import { existsSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { COVER_WIDTHS } from '../src/lib/cover.js'
import { at } from './lib/paths.mjs'

const dir = at('public', 'covers')
const originals = readdirSync(dir).filter((name) => /\.(jpe?g|png)$/i.test(name))
const kb = (file) => `${Math.round(statSync(file).size / 1024)} KB`

for (const name of originals) {
  const source = path.join(dir, name)
  const base = name.replace(/\.[^.]+$/, '')
  const { width, height } = await sharp(source).metadata()
  console.log(`${name}  ${width}x${height}, ${kb(source)}`)
  console.log(`  in src/data/content.js use: cover('${base}', ${width}, ${height})`)

  for (const size of COVER_WIDTHS) {
    if (size > width) continue
    const target = path.join(dir, `${base}-${size}.webp`)
    if (existsSync(target) && statSync(target).mtimeMs >= statSync(source).mtimeMs) {
      console.log(`  ${path.basename(target)}  up to date`)
      continue
    }
    await sharp(source).resize({ width: size }).webp({ quality: 74, effort: 6 }).toFile(target)
    console.log(`  ${path.basename(target)}  ${kb(target)}`)
  }
}
