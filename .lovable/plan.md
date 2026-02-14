

## Remove "Coming Soon" Cover Override

The GenieLink card currently loads its image from the Supabase `Covers` table entry named `"coming-soon"` first, and only falls back to the local `cover-genielink.jpg` asset if no Supabase record exists. Since the old "Coming Soon" padlock image is stored in Supabase, it keeps overriding the new genie lamp asset.

### What will change

| File | Change |
|------|--------|
| `src/pages/Index.tsx` | Remove the Supabase cover override for the GenieLink card -- always use the local `genieLinkCover` import directly instead of `projectCovers["coming-soon"].imageUrl \|\| genieLinkCover` |
| `src/pages/Index.tsx` | Remove the `"coming-soon"` key from `projectCovers` state and the related fetch logic, since it's no longer needed |
| `src/pages/Index.tsx` | Update the editor mode pencil button from `setEditingProject("coming-soon")` to `setEditingProject("genielink")` (or remove it if cover editing via Supabase is no longer needed for this card) |

### Result

The GenieLink card will always display the locally imported `cover-genielink.jpg` (the genie lamp), ignoring any old Supabase "coming-soon" record.

