

## Replace GenieLink Cover Image

The GenieLink card on the homepage still displays the old "Coming Soon" lock/padlock image. It needs to be replaced with a **genie lamp** illustration that matches the visual style of the other two project covers:

- **Newsletter cover**: dark brown background, orange monoline line-art of financial/chart icons
- **AI Billboard cover**: dark brown background, orange monoline line-art of a VR figure with media icons

### What will change

| File | Change |
|------|--------|
| `src/assets/cover-genielink.jpg` | Regenerate with a genie lamp illustration in the same dark brown background + orange outline-only line-art style |

### Image specification

- Dark brown/charcoal background (matching the exact tones of the other two covers)
- Orange monoline line-art (thin outlines, no fills)
- Central genie lamp with magical elements (sparkles, links/chains, or connected nodes rising from the lamp)
- No text overlays (no "Coming Soon" or any other text)
- Same landscape aspect ratio as the other covers

No code changes are needed -- only the image asset will be replaced. The existing `import genieLinkCover` and `<img>` references will automatically pick up the new file.

