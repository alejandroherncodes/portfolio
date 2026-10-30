"""Local portfolio preview with live reload. Run: python3 dev.py"""

import hashlib
import io
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit


ROOT = Path(__file__).resolve().parent
RELOAD_PATH = "/__dev_version"
WATCHED_SUFFIXES = {
    ".html", ".css", ".js", ".json", ".svg", ".png", ".jpg", ".jpeg",
    ".webp", ".gif", ".avif", ".ico", ".woff", ".woff2", ".pdf", ".txt",
}


def version():
    """Include edits, added files, and deleted files, skipping hidden folders."""
    digest = hashlib.sha256()
    for path in sorted(ROOT.rglob("*")):
        relative = path.relative_to(ROOT)
        if any(part.startswith(".") for part in relative.parts):
            continue
        if path.suffix.lower() not in WATCHED_SUFFIXES:
            continue
        try:
            stat = path.stat()
        except FileNotFoundError:
            continue
        digest.update(f"{relative}:{stat.st_mtime_ns}:{stat.st_size}".encode())
    return digest.hexdigest()


def reload_script(initial_version):
    return f"""<script>
(() => {{
  const initialVersion = {initial_version!r};
  async function check() {{
    try {{
      const response = await fetch('{RELOAD_PATH}', {{ cache: 'no-store' }});
      if (response.ok && (await response.text()) !== initialVersion) {{
        location.reload();
        return;
      }}
    }} catch {{ /* Keep checking while the preview server restarts. */ }}
    setTimeout(check, 700);
  }}
  setTimeout(check, 700);
}})();
</script>"""


class PreviewHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def send_head(self):
        request_path = urlsplit(self.path).path
        if request_path == RELOAD_PATH:
            content = version().encode()
            content_type = "text/plain; charset=utf-8"
        else:
            path = Path(self.translate_path(self.path))
            if path.is_dir():
                path = path / "index.html"
            if not path.is_file() or path.suffix.lower() != ".html":
                return super().send_head()
            # Capture the version first so a save during the read triggers a reload.
            current_version = version()
            html = path.read_text(encoding="utf-8")
            injection = reload_script(current_version)
            html = html.replace("</body>", injection + "</body>")
            content = html.encode()
            content_type = "text/html; charset=utf-8"

        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(content)))
        self.end_headers()
        return io.BytesIO(content)

    def log_message(self, format, *args):
        if urlsplit(self.path).path != RELOAD_PATH:
            super().log_message(format, *args)


if __name__ == "__main__":
    try:
        server = ThreadingHTTPServer(("127.0.0.1", 8000), PreviewHandler)
    except OSError as error:
        raise SystemExit(f"Could not start localhost:8000: {error}\nStop the old server with Ctrl+C, then try again.")
    print("Live preview: http://localhost:8000\nSave a file to reload. Ctrl+C to stop.", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
