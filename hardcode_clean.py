import json

with open('src/data/songs.json', encoding='utf-8') as f:
    data = json.load(f)

for s in data:
    title = s['title']
    
    # Handle specific full-width or em-dash symbols
    for sep in ['｜', '—', '•', '+', ' - ']:
        if sep in title:
            # Special case for "Ton Carfi - Minha Vez part. Livinho"
            if "Minha Vez" in title and sep == ' - ':
                title = "Minha Vez"
                continue
            # Special case for "Alessandro Vilas Boas O Carpinteiro"
            if "O Carpinteiro" in title and sep == '+':
                title = "O Carpinteiro"
                continue
                
            title = title.split(sep)[0].strip()
            
    # Extra cleanup
    title = title.replace('(Versão Lyric Vídeo)', '').strip()
    title = title.replace('O Cordeiro, o Leão e o Trono Parte 1', '').strip()
    title = title.replace('(DVD AO VIVO)', '').strip()
    
    if "JUNINHO CASSIMIRO" in title:
        title = title.replace("JUNINHO CASSIMIRO", "").strip()
        
    if "Alessandro Vilas Boas" in title:
        title = title.replace("Alessandro Vilas Boas", "").strip()
        
    if title.startswith("-"):
        title = title[1:].strip()
        
    if title.lower() == "o poço":
        title = "O Poço"

    s['title'] = title.strip()

with open('src/data/songs.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=4, ensure_ascii=False)

print("Nomes limpos manualmente com sucesso!")
