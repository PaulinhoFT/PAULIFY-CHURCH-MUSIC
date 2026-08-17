const fs = require('fs');
const { execSync } = require('child_process');

const songsPath = './src/data/songs.json';
const songs = JSON.parse(fs.readFileSync(songsPath, 'utf8'));

console.log(`Encontradas ${songs.length} músicas.`);

let updatedCount = 0;

for (let i = 0; i < songs.length; i++) {
  const song = songs[i];
  if (song.audioUrl && !song.youtubeId) {
    const searchQuery = `${song.title} ${song.artist}`;
    console.log(`[${i+1}/${songs.length}] Buscando ID para: ${searchQuery}...`);
    try {
      const output = execSync(`yt-dlp "ytsearch1:${searchQuery}" --get-id`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
      
      const lines = output.trim().split('\n');
      // yt-dlp might output some warnings, the last line is usually the ID
      const videoId = lines[lines.length - 1].trim();

      if (videoId && videoId.length === 11) { // YouTube IDs are 11 chars
        song.youtubeId = videoId;
        delete song.audioUrl;
        updatedCount++;
        console.log(`  -> Sucesso! ID: ${videoId}`);
      } else {
        console.log(`  -> Falha. Retorno inesperado: ${videoId}`);
      }
    } catch (e) {
      console.log(`  -> Erro ao buscar: ${e.message}`);
    }
    
    // Salva periodicamente
    fs.writeFileSync(songsPath, JSON.stringify(songs, null, 4));
  } else {
    console.log(`[${i+1}/${songs.length}] Pulando: ${song.title} (já possui youtubeId)`);
  }
}

console.log(`Migração completa! ${updatedCount} músicas atualizadas.`);
