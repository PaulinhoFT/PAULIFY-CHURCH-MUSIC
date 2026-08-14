import json
import sys

# Ensure stdout uses utf-8
sys.stdout.reconfigure(encoding='utf-8')

with open('src/data/songs.json', encoding='utf-8') as f:
    data = json.load(f)

for s in data:
    print(f"{s['id']}: {s['title']} | Artist: {s['artist']}")
