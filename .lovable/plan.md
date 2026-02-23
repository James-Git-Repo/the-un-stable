

## Add Inline Image Upload to Article Editor

Allow editors to insert images directly into the article body when creating or editing articles. Since the editor uses a standard `<textarea>` for HTML content, we will add an "Insert Image" button that uploads the selected image to Supabase Storage and inserts the corresponding `<img>` HTML tag into the textarea at the cursor position.

### What will change

| File | Change |
|------|--------|
| `src/pages/NewsletterNew.tsx` | Add an "Insert Image" button above the content textarea that opens a file picker, uploads the image to Supabase Storage (`article-images/inline/`), and inserts an `<img>` tag at the cursor position |
| `src/pages/NewsletterEdit.tsx` | Same "Insert Image" button and upload logic added to the edit form |

### How it works

1. An "Insert Image" button (with an Image icon) appears in a small toolbar row just above the content textarea
2. Clicking it opens a file picker (accept: `image/*`)
3. The selected image is uploaded to `article-images/inline/{timestamp}.{ext}` in Supabase Storage
4. On success, an `<img src="..." alt="Article image" style="max-width:100%; border-radius:8px; margin:16px 0;" />` tag is inserted into the textarea at the current cursor position
5. A loading indicator shows during upload
6. Images already render in articles because SafeHTML allows `img` tags

### Technical details

- Reuse the existing `supabase.storage.from('article-images')` bucket (already used for cover images)
- Use a hidden `<input type="file">` triggered by the button click via a ref
- Insert HTML at cursor position using `textarea.selectionStart` to splice the tag into the content string
- Add a small `uploading` state to disable the button during upload and show feedback via toast

