# Portfolio

Alejandro Hernandez’s writing portfolio. Plain HTML, CSS, and JavaScript; no dependencies or build step.

Run `python3 dev.py` and open http://localhost:8000. Changes reload automatically. Use HTTP so the article reader can load its text files.

- `articles.js`: writing cards, article paths, colors, and publication details.
- `articles/`: article text as HTML fragments.
- `assets/tastemakers/`: magazine page images.
- `assets/writing/screenFinal.pdf`: final paper.
- `assets/writing/screen-final/` and `assets/writing/adela/`: PDF page images for the reader. Re-export these images when updating their PDFs.
- `index.html`: page structure and reader dialog.
- `script.js`: card rendering, readers, and book animations.
- `style.css`: site and reader styles.
