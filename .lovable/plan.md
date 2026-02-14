

## GenieLink Card Updates

### 1. Create a new GenieLink intermediate page

A new page at `/genielink` will be created with:
- A description of GenieLink (the text you provided about it being a free link-in-bio platform)
- A prominent call-to-action button that links out to the external GenieLink site (you'll provide the URL later)
- Styled consistently with the rest of the site

The GenieLink card on the homepage will change from an external `<a>` tag to a React Router `<Link>` pointing to `/genielink`.

### 2. Generate a new cover image matching the existing style

A new cover will be generated using AI image generation to match the exact visual style of the other two covers:
- **Dark brown/black background**
- **Orange line-art illustration style** (flat, monoline icons)
- **Theme**: Link/chain icons, bio-page mockup, or connected profile elements to represent GenieLink's purpose

The new image will replace the current `src/assets/cover-genielink.jpg`.

### Technical changes

| File | Change |
|------|--------|
| `src/pages/GenieLink.tsx` | New intermediate page with GenieLink description and external CTA button |
| `src/App.tsx` | Add `/genielink` route |
| `src/pages/Index.tsx` | Change `<a href="https://genielink.me">` to `<Link to="/genielink">` |
| `src/assets/cover-genielink.jpg` | Regenerated cover image in matching dark + orange line-art style |

