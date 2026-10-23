// Cover images live in public/covers/. For a book called "my_book" you keep ONE file there,
//   public/covers/my_book.jpg
// and `npm run covers` makes the small WebP copies (my_book-320.webp, -480.webp, -720.webp) that
// phones download instead of the big JPG. Pages load much faster that way, which search engines like.
export const COVER_WIDTHS = [320, 480, 720]

// width and height are the pixel size of the JPG. They let the browser save the right amount of
// space before the picture arrives, so the page does not jump while it loads.
export function cover(name, width, height) {
  return {
    src: `/covers/${name}.jpg`,
    srcSet: COVER_WIDTHS.map((w) => `/covers/${name}-${w}.webp ${w}w`).join(', '),
    width,
    height,
  }
}
