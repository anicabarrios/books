# Customizing the look

- Colors, fonts, spacing, line colors and shadows are variables at the top of [`src/styles/tokens.css`](../src/styles/tokens.css). The main button color is `--coral`.
- Cards use the `.pop` class in [`src/styles/motifs.css`](../src/styles/motifs.css): flat color with a soft shadow and no outline.
- The CSS is split into one file per area in [`src/styles/`](../src/styles/).
- The text of the home page lives in [`src/data/`](../src/data/) (books, holidays, games, navigation) and in [`src/components/`](../src/components/).

## Light theme only

The site is light on purpose (`color-scheme: only light`), so Chrome does not darken it by itself. Samsung Internet's own "website dark theme" setting is a phone-side option that a site cannot switch off.
