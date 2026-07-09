from pathlib import Path
import re

root = Path(__file__).resolve().parent
repo = root.parents[1]
home = Path.home()
paths = [root / 'logs', root / 'generated-repo' / 'artifacts' / 'terminal']
patterns = [
    (re.escape(str(repo)), 'WORKSPACE'),
    (re.escape(str(home)), 'HOME'),
    (r'https?://127\.0\.0\.1(?::\d+)?', 'LOCAL_PREVIEW_URL'),
    (r'https?://localhost(?::\d+)?', 'LOCAL_PREVIEW_URL'),
    (r'\b127\.0\.0\.1\b', 'LOCALHOST'),
    (r'\blocalhost\b', 'LOCALHOST'),
]
for base in paths:
    if not base.exists():
        continue
    for path in base.rglob('*'):
        if path.is_file() and path.suffix.lower() in {'.log', '.txt', '.html'}:
            text = path.read_text(encoding='utf-8', errors='ignore')
            for pat, repl in patterns:
                text = re.sub(pat, repl, text)
            path.write_text(text, encoding='utf-8')
print('sanitized logs')
