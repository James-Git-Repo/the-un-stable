

## Enhance Newsletter Article Reading Experience

This plan covers three improvements to the article reading experience:

### 1. Justify All Text

Update the text alignment so all paragraph content in articles is justified (evenly aligned on both left and right margins). This applies to:
- The article body content rendered via SafeHTML
- The subtitle/dek text
- The PostCard descriptions on listing pages

**Files changed:**
- `src/components/SafeHTML.tsx` -- add `text-justify` to the base wrapper class
- `src/styles/editor.css` -- ensure prose paragraph styles default to `text-align: justify`
- `src/pages/Post.tsx` -- clean up redundant justify classes (already partially there)

### 2. Add Cover Image at Top of Articles

Each article already has a `cover_image` (image_url) stored in Supabase. Currently it only shows on the card in the listing pages but not on the article page itself. We will display the cover image as a hero banner at the top of each article, giving readers a visual anchor.

**Files changed:**
- `src/pages/Post.tsx` -- add an `<img>` block showing `post.image_url` as a full-width hero image above the article title, with a 16:9 aspect ratio and rounded corners
- `src/components/SafeHTML.tsx` -- add `img` to `ALLOWED_TAGS` so any inline images in article HTML content are also rendered

### 3. Expand "Related Articles" Section

Currently the Post page fetches only 2 related articles with the same tag. We will improve this to:
- Increase the limit to 3 related articles
- If fewer than 3 articles share the same tag, backfill with the most recent articles from other tags
- Show the cover image thumbnail alongside each related article card
- Add a "Continue Reading" label to make the section more inviting

**Files changed:**
- `src/pages/Post.tsx` -- update the related posts fetching logic to get up to 3 same-tag articles, then backfill from recent articles if needed. Update the related posts UI to include cover image thumbnails and a horizontal card layout.

---

### Technical Details

**SafeHTML.tsx changes:**
- Add `img` and `figure`, `figcaption` to `ALLOWED_TAGS`
- Add `src`, `alt`, `width`, `height` to `ALLOWED_ATTR`
- Add `text-justify` to the base wrapper className

**Post.tsx changes:**
- Add hero image block: `{post.image_url && <img src={post.image_url} ... />}` before the title
- Related posts logic: fetch 3 same-tag articles; if result count < 3, run a second query for recent articles excluding current and already-fetched IDs, merge results
- Related posts UI: switch from vertical text-only cards to horizontal cards with thumbnail image on the left, title/subtitle/date on the right

**editor.css changes:**
- Update `.prose p` default to include `text-align: justify`
