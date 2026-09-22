# Anthropic product illustrations

Anthropic's own line-art illustrations, pulled from their published product and
announcement pages. **These are Anthropic's artwork, not ours.** They are kept
here for editorial use in posts and newsletters that are about Anthropic
products. Do not use them to decorate pages about our own product, and do not
alter the linework.

Each file is 1000x1000, black linework with a cream (`#FAF9F5`) fill block, on a
transparent background.

| File | Shows | Use it for |
|---|---|---|
| `writing-on-a-page` | A hand drawing on a page | Claude Docs, writing, editing |
| `presentation-screen` | A pull-down screen with a line chart, and a hand | Claude Slides, decks, presenting |
| `window-and-cursor` | A browser window with a pointer | Artifacts generally, prototypes, apps |
| `hands-and-starburst` | Two hands around the Claude starburst | Claude as a collaborator, generic |

## SVG or PNG

Both are provided for every illustration, and which one you reach for is decided
entirely by where it is going.

- **On the site, use the `.svg`.** It is a tenth of the size and stays sharp.
- **In an email, use the `.png`.** Gmail and most other mail clients strip SVG
  entirely, so an `.svg` in a newsletter renders as nothing at all.

The PNGs were generated from the SVGs with `qlmanage -t -s 1000`. Regenerate them
the same way if a source file is ever replaced.

## Source

Pulled 22 September 2026 from Anthropic's CDN, as published on their Claude
Design announcement and their blog:

```
https://www-cdn.anthropic.com/images/4zrzovbb/website/<hash>-1000x1000.svg
```

| File | Hash |
|---|---|
| `writing-on-a-page` | `33dbe8f783d4835a838b4c4ae85d3c04e352fee1` |
| `presentation-screen` | `6507d83d1197bb8630131d363fb8bea838d79ca7` |
| `window-and-cursor` | `33ddc751e21fb4b116b3f57dd553f0bc55ea09d1` |
| `hands-and-starburst` | `6905c83d0735e1bc430025fdd1748d1406079036` |

They are copied here rather than hotlinked on purpose: a hotlinked CDN asset
breaks silently the moment Anthropic reorganises, and an email that has already
been sent cannot be fixed.
