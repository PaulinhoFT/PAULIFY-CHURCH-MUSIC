import os
import json
import difflib

base_dir = r"c:\Users\Paulo Felix\Desktop\Paulify\paulify-web"
cover_dir = os.path.join(base_dir, "public", "Capa da musica")
data_path = os.path.join(base_dir, "src", "data", "songs.json")

with open(data_path, "r", encoding="utf-8") as f:
    songs = json.load(f)

# Get all images available in Capa da musica
images = []
if os.path.exists(cover_dir):
    images = [f for f in os.listdir(cover_dir) if f.endswith(('.jpg', '.jpeg', '.png', '.webp'))]

for song in songs:
    if not song.get("coverUrl"):
        # We need to find the best match for this song.
        # The audio file name is song['audioUrl'].split('/')[-1]
        basename = os.path.splitext(song['audioUrl'].split('/')[-1])[0]
        
        # Try exact match without (youtube)
        fallback_basename = basename.replace(' (youtube)', '').replace('(youtube)', '').strip()
        
        found_cover = None
        # 1. Exact match with fallback
        for ext in ['.webp', '.jpg', '.png', '.jpeg']:
            if fallback_basename + ext in images:
                found_cover = f"/Capa da musica/{fallback_basename}{ext}"
                break
                
        # 2. Fuzzy match against all image names
        if not found_cover and images:
            # try to match audio basename with image name
            matches = difflib.get_close_matches(basename, images, n=1, cutoff=0.6)
            if matches:
                found_cover = f"/Capa da musica/{matches[0]}"
                
        if found_cover:
            song["coverUrl"] = found_cover

with open(data_path, "w", encoding="utf-8") as f:
    json.dump(songs, f, indent=4, ensure_ascii=False)

print("Linked missing covers via fuzzy and fallback matching!")
