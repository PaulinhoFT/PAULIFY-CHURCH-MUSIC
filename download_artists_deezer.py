import os
import json
import requests
import time

def download_artist_images():
    songs_file = './src/data/songs.json'
    artists_dir = './public/artists'
    
    os.makedirs(artists_dir, exist_ok=True)
    
    with open(songs_file, 'r', encoding='utf-8') as f:
        songs = json.load(f)
        
    artists = sorted(list(set(song['artist'] for song in songs)))
    
    for artist in artists:
        safe_name = artist.replace(' ', '_').replace('/', '_')
        img_path = os.path.join(artists_dir, f"{safe_name}.jpg")
        
        if os.path.exists(img_path):
            print(f"Skipping {artist}, image already exists.")
            continue
            
        print(f"Searching Deezer for {artist}...")
        try:
            search_url = f"https://api.deezer.com/search/artist?q={artist}"
            response = requests.get(search_url, timeout=10)
            data = response.json()
            
            if 'data' in data and len(data['data']) > 0:
                img_url = data['data'][0]['picture_xl'] # Try XL image
                if not img_url:
                    img_url = data['data'][0]['picture_medium']
                
                print(f"Found URL: {img_url}")
                
                # Download
                img_response = requests.get(img_url, timeout=10)
                if img_response.status_code == 200:
                    with open(img_path, 'wb') as img_file:
                        img_file.write(img_response.content)
                    print(f"Downloaded {artist}")
                else:
                    print(f"Failed to download image for {artist} (HTTP {img_response.status_code})")
            else:
                print(f"No results for {artist}")
        except Exception as e:
            print(f"Error fetching {artist}: {e}")
            
        time.sleep(1) # Be nice to the API

if __name__ == '__main__':
    download_artist_images()
