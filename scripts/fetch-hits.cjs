const fs = require('fs');
const { execSync } = require('child_process');

const songsPath = './src/data/songs.json';
let songs = JSON.parse(fs.readFileSync(songsPath, 'utf8'));

// Pegar artistas únicos
const artists = [...new Set(songs.map(s => s.artist))];
console.log(`Buscando hits massivos para ${artists.length} artistas...`);

let newSongsCount = 0;

artists.forEach((artist, index) => {
  console.log(`\n[${index + 1}/${artists.length}] Buscando Top 30 hits de: ${artist}`);
  try {
    // Usamos ytsearch30 para pegar bastante volume, focando em "música oficial" para evitar pregações/vlogs
    const query = `ytsearch30:${artist} música oficial`;
    const output = execSync(`yt-dlp "${query}" --print "%(title)s|%(id)s"`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
    
    const lines = output.trim().split('\n');
    lines.forEach(line => {
      if (!line.includes('|')) return;
      let [title, videoId] = line.split('|');
      title = title.trim();
      videoId = videoId.trim();

      // Checar se já temos essa música (mesmo ID ou mesmo título exato pelo artista)
      const alreadyExists = songs.some(s => s.youtubeId === videoId || (s.title.toLowerCase() === title.toLowerCase() && s.artist === artist));
      
      if (!alreadyExists && videoId.length === 11) {
        // Gerar novo ID sequencial interno
        const nextId = songs.length > 0 ? Math.max(...songs.map(s => s.id)) + 1 : 1;
        
        songs.push({
          id: nextId,
          title: title,
          artist: artist,
          youtubeId: videoId,
          coverUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
        });
        
        newSongsCount++;
        console.log(`  ➕ Adicionado: ${title}`);
      }
    });

    // Salvar no JSON após cada artista para ir persistindo progresso
    fs.writeFileSync(songsPath, JSON.stringify(songs, null, 4));

  } catch (err) {
    console.error(`  Erro ao buscar hits de ${artist}: ${err.message}`);
  }
});

console.log(`\n🎉 Expansão concluída! ${newSongsCount} novos HITS foram adicionados ao catálogo!`);
