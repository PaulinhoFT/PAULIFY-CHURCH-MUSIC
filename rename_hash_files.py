import os
import json

base_dir = r"c:\Users\Paulo Felix\Desktop\Paulify\paulify-web"
music_dir = os.path.join(base_dir, "public", "musica")
cover_dir = os.path.join(base_dir, "public", "Capa da musica")
data_path = os.path.join(base_dir, "src", "data", "songs.json")

with open(data_path, "r", encoding="utf-8") as f:
    songs = json.load(f)

for d in [music_dir, cover_dir]:
    for filename in os.listdir(d):
        if "#" in filename:
            new_filename = filename.replace("#", "_")
            os.rename(os.path.join(d, filename), os.path.join(d, new_filename))

# Now fix the URLs in songs.json
for s in songs:
    if s.get("audioUrl") and "#" in s["audioUrl"]:
        s["audioUrl"] = s["audioUrl"].replace("#", "_")
    if s.get("coverUrl") and "#" in s["coverUrl"]:
        s["coverUrl"] = s["coverUrl"].replace("#", "_")
        
with open(data_path, "w", encoding="utf-8") as f:
    json.dump(songs, f, indent=4, ensure_ascii=False)

print("Fixed filenames with #")
