## Make Article Images Fit the Text Consistently

Currently inline images inserted into articles render at their inline `style="max-width:100%"`, but since older uploads use different inline styles and some images have explicit `width`/`height` attributes, they appear in varying sizes (some smaller, some larger), breaking the visual rhythm of the article.

### What will change

Force every image inside the article body (`.prose`) to render at the same width as the surrounding text, centered, with consistent spacing and rounded corners — regardless of the inline styles, width, or height attributes set when the image was originally uploaded.

| File | Change |
|------|--------|
| `src/styles/editor.css` | Add a `.prose img` rule that forces `display: block`, `width: 100%`, `height: auto`, `margin: 1.5rem auto`, `border-radius: 8px`, and `object-fit: contain`. Use `!important` to override any legacy inline `width`, `height`, and `style` attributes from previously uploaded images. Also style `.prose figure` (block, centered, no margin override) and `.prose figcaption` (centered, muted, small text) for captioned images |
| `src/components/SafeHTML.tsx` | No structural change needed — the CSS above will normalize all existing and future images automatically |

### Result

- Every inline image in every article (old and new) renders at the full text-column width
- Images are vertically spaced consistently (1.5rem above and below)
- Captions (if present) are centered and styled as muted small text
- The hero image at the top of the article (rendered separately in `Post.tsx`) is unaffected
