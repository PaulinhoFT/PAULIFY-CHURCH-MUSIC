const fs = require('fs');
const path = require('path');
const https = require('https');

const songsPath = './src/data/songs.json';
const artistsDir = './public/artists';
let songs = JSON.parse(fs.readFileSync(songsPath, 'utf8'));

// Helper for ArtistCard image path logic
const artistImagePath = (artistName) =>
  `${artistName.replace(/ /g, '_').replace(/\//g, '_')}.jpg`;

const artists = [...new Set(songs.map(s => s.artist))];

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(filepath))
           .on('error', reject)
           .once('close', () => resolve(filepath));
      } else {
        res.resume();
        reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
      }
    });
  });
};

(async () => {
  console.log('Verificando fotos de cantores...');
  for (const artist of artists) {
    const filename = artistImagePath(artist);
    const filepath = path.join(artistsDir, filename);

    if (!fs.existsSync(filepath)) {
      console.log(`Foto faltando para: ${artist}. Baixando capa da música mais famosa...`);
      // Pega a primeira música dele
      const firstSong = songs.find(s => s.artist === artist);
      if (firstSong && firstSong.coverUrl) {
        try {
          await downloadImage(firstSong.coverUrl, filepath);
          console.log(` ✅ Foto salva: ${filename}`);
        } catch (err) {
          console.error(` ❌ Erro ao baixar foto de ${artist}:`, err);
        }
      }
    }
  }
  console.log('Concluído!');
})();
