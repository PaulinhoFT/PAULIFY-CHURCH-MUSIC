import os
import json
import requests
from duckduckgo_search import DDGS
import urllib.parse
import time

def download_artist_images():
    songs_file = './src/data/songs.json'
    artists_dir = './public/artists'
    
    os.makedirs(artists_dir, exist_ok=True)
    
    with open(songs_file, 'r', encoding='utf-8') as f:
        songs = json.load(f)
        
    artists = sorted(list(set(song['artist'] for song in songs)))
    
    ddgs = DDGS()
    
    for artist in artists:
        safe_name = artist.replace(' ', '_').replace('/', '_')
        img_path = os.path.join(artists_dir, f"{safe_name}.jpg")
        
        if os.path.exists(img_path):
            print(f"Skipping {artist}, image already exists.")
            continue
            
        print(f"Searching image for {artist}...")
        try:
            # Search for square-ish images or just standard images
            query = f"{artist} cantor banda gospel"
            results = list(ddgs.images(query, max_results=1))
            
            if results and len(results) > 0:
                img_url = results[0]['image']
                print(f"Found URL: {img_url}")
                
                # Download
                headers = {'User-Agent': 'Mozilla/5.0'}
                response = requests.get(img_url, headers=headers, timeout=10)
                if response.status_code == 200:
                    with open(img_path, 'wb') as img_file:
                        img_file.write(response.content)
                    print(f"Downloaded {artist}")
                else:
                    print(f"Failed to download {artist} (HTTP {response.status_code})")
            else:
                print(f"No results for {artist}")
        except Exception as e:
            print(f"Error fetching {artist}: {e}")
            
        time.sleep(1) # Be nice to the API

if __name__ == '__main__':
    download_artist_images()
