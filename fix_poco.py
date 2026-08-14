import json

with open('src/data/songs.json', encoding='utf-8') as f:
    data = json.load(f)

for s in data:
    if s['id'] == 18:
        s['title'] = "O Poço"

with open('src/data/songs.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=4, ensure_ascii=False)
