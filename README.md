# Portfolio

Alejandro Hernandez’s writing portfolio. Plain HTML, CSS, and JavaScript, with shared SVG book surfaces generated alongside Textures.js patterns.

Run `python3 dev.py` and open http://localhost:8000. Changes reload automatically. Use HTTP so the article reader can load its text files.

The texture and icon bundles are committed in `assets/vendor/`, so the site can be served directly. After changing `book-texture.js`, `footer-icons.js`, or their packages, run `npm ci` and `npm run build` to rebuild them.

- `articles.js`: writing cards, article paths, colors, and publication details.
- `articles/`: article text as HTML fragments.
- `assets/tastemakers/`: magazine page images.
- `assets/writing/screenFinal.pdf`: final paper.
- `assets/writing/screen-final/` and `assets/writing/adela/`: PDF page images for the reader. Re-export these images when updating their PDFs.
- `index.html`: page structure and reader dialog.
- `script.js`: card rendering, readers, and book animations.
- `style.css`: site and reader styles.
- `book-texture.js`: shared cover grain, lighting, spine, page edges, and shadow presets.
- `footer-icons.js`: LinkedIn, email, and animated back-to-top plane icons.
