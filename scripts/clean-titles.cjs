const fs = require('fs');

const songsPath = './src/data/songs.json';
let songs = JSON.parse(fs.readFileSync(songsPath, 'utf8'));

// Dicionário de substituição de caracteres corrompidos com \uFFFD exato
const dic = {
  "S\uFFFDo": "São", "Jo\uFFFDo": "João", "C\uFFFDntico": "Cântico", "C\uFFFDnticos": "Cânticos", "Pr\uFFFDncipe": "Príncipe",
  "est\uFFFD": "está", "voc\uFFFD": "você", "Confian\uFFFDa": "Confiança", "Est\uFFFD": "Está", "Fl\uFFFDvio": "Flávio",
  "Ros\uFFFDrio": "Rosário", "B\uFFFDblia": "Bíblia", "Gl\uFFFDria": "Glória", "N\uFFFDo": "Não", "Voc\uFFFD": "Você",
  "Conv\uFFFDvio": "Convívio", "\uFFFDlbum": "Álbum", "Falc\uFFFDo": "Falcão", "Po\uFFFDo": "Poço", "DECIS\uFFFDO": "DECISÃO",
  "D\uFFFD-me": "Dá-me", "gra\uFFFDa": "graça", "F\uFFFD": "Fé", "GRA\uFFFDA": "GRAÇA", "Paix\uFFFDo": "Paixão", "M\uFFFDstico": "Místico",
  "Decis\uFFFDo": "Decisão", "M\uFFFDsicas": "Músicas", "\uFFFDltimos": "últimos", "Le\uFFFDo": "Leão", "Mois\uFFFDs": "Moisés",
  "Hist\uFFFDria": "História", "HER\uFFFDI": "HERÓI", "S\uFFFD": "Só", "H\uFFFD": "Há", "[V\uFFFDdeo": "[Vídeo",
  "separa\uFFFD\uFFFDo": "separação", "Can\uFFFD\uFFFDo": "Canção", "Sime\uFFFDo": "Simeão", "Vers\uFFFDo)": "Versão)",
  "Espont\uFFFDneo": "Espontâneo", "N\uFFFDvea": "Nívea", "Gra\uFFFDa": "Graça", "Andr\uFFFD": "André", "Lan\uFFFDamentos": "Lançamentos",
  "Participa\uFFFD\uFFFDes": "Participações", "Adora\uFFFD\uFFFDo": "Adoração", "V\uFFFDdeo)": "Vídeo)", "R\uFFFDdio": "Rádio",
  "360\uFFFD": "360º", "F\uFFFDcil": "Fácil", "(Cl\uFFFDssicos": "(Clássicos", "Ess\uFFFDncia": "Essência",
  "Trai\uFFFDoeiras": "Traiçoeiras", "Al\uFFFD": "Alô", "Cora\uFFFD\uFFFDo": "Coração", "c\uFFFDu": "céu",
  "Ora\uFFFD\uFFFDo": "Oração", "Esp\uFFFDrito": "Espírito", "Comunh\uFFFDo": "Comunhão", "Ningu\uFFFDm": "Ninguém",
  "(\uFFFDudio": "(Áudio", "Trai\uFFFDoeiras,": "Traiçoeiras,", "Trai\uFFFDoeiras)": "Traiçoeiras)", "Qu\uFFFDo": "Quão",
  "\uFFFDs": "és", "Al\uFFFDvio": "Alívio", "For\uFFFDa": "Força", "Vit\uFFFDria": "Vitória", "D\uFFFD": "Dá",
  "can\uFFFD\uFFFDes": "canções", "cat\uFFFDlicas,": "católicas,", "P\uFFFDo": "Pão", "C\uFFFDu": "Céu",
  "F\uFFFDbio": "Fábio", "(\uFFFDlbum": "(Álbum", "miss\uFFFDo": "missão", "Di\uFFFDrio": "Diário", "M\uFFFDe": "Mãe",
  "cora\uFFFD\uFFFDo": "coração", "F\uFFFDtima": "Fátima", "Abra\uFFFDo": "Abraço", "General\uFFFDssima": "Generalíssima",
  "Tenta\uFFFD\uFFFDo": "Tentação", "Irm\uFFFD": "Irmã", "Patr\uFFFDcia": "Patrícia", "PATR\uFFFDCIA": "PATRÍCIA",
  "Coura\uFFFDa": "Couraça", "Fa\uFFFDa": "Faça", "Mission\uFFFDria)": "Missionária)", "MARACAN\uFFFDZINHO": "MARACANÃZINHO",
  "INABAL\uFFFDVEL": "INABALÁVEL", "Milh\uFFFDes": "Milhões", "Faf\uFFFD": "Fafá", "Bel\uFFFDm": "Belém",
  "Tel\uFFFD": "Teló", "Imposs\uFFFDvel": "Impossível", "M\uFFFDos": "Mãos", "f\uFFFD": "fé", "Fam\uFFFDlia": "Família",
  "T\uFFFD": "Tá", "M\uFFFDo": "Mão", "Fa\uFFFDa-me": "Faça-me", "\uFFFDguas": "Águas", "(Ac\uFFFDstico),": "(Acústico),",
  "cat\uFFFDlicas": "católicas", "Cat\uFFFDlicas": "Católicas", "M\uFFFDsica": "Música", "Cat\uFFFDlica": "Católica",
  "cora\uFFFD\uFFFDo!": "coração!", "M\uFFFD\uFFFDSICA": "MÚSICA", "CAT\uFFFD\uFFFDLICA": "CATÓLICA", "Mission\uFFFDrio": "Missionário",
  "(Oxig\uFFFDnio)": "(Oxigênio)", "Sustentar\uFFFD": "Sustentará", "MISSION\uFFFDRIO": "MISSIONÁRIO", "Bras\uFFFDlia": "Brasília",
  "Na\uFFFD\uFFFDes)": "Nações)", "Minist\uFFFDrio": "Ministério", "Her\uFFFDi": "Herói", "Esperan\uFFFDa": "Esperança",
  "\uFFFDcone": "Ícone", "Mnist\uFFFDrio": "Ministério", "Gratid\uFFFDo": "Gratidão", "n\uFFFDs": "nós",
  "Para\uFFFDso": "Paraíso", "S\uFFFDS": "SÓS", "ADORA\uFFFD\uFFFDO": "ADORAÇÃO", "adora\uFFFD\uFFFDo": "adoração",
  "(Minist\uFFFDrio": "(Ministério", "Adora\uFFFD\uFFFDo)": "Adoração)",
  "\uFFFD": "é" // Fallback para "é" isolado (cuidado)
};

const cleanTitle = (title, artist) => {
  let cleaned = title;

  // Restaurar acentuação usando o dicionário seguro
  for (const [corrupt, fixed] of Object.entries(dic)) {
    // Agora split usa a string exata, incluindo o \uFFFD
    cleaned = cleaned.split(corrupt).join(fixed);
  }

  // 1. Remover tudo depois de hífens duplos ou certos separadores se houver nome de artista lá
  const splitters = [' - ', ' | ', ' // ', ' / ', ' _ ', ' __ '];
  for (const sep of splitters) {
    if (cleaned.includes(sep)) {
      const parts = cleaned.split(sep);
      if (parts[0].toLowerCase().includes(artist.toLowerCase().split(' ')[0])) {
        cleaned = parts[1];
      } else {
        cleaned = parts[0];
      }
    }
  }

  // 2. Remover lixo entre parênteses e colchetes
  cleaned = cleaned.replace(/\(.*?\)/g, '').replace(/\[.*?\]/g, '');

  // 3. Remover nome do artista se ainda sobrou
  const artistParts = artist.split(' ').filter(p => p.length > 2);
  artistParts.forEach(p => {
    const reg = new RegExp(p, 'gi');
    cleaned = cleaned.replace(reg, '');
  });

  // 4. Limpar palavras-chave residuais que costumam sujar títulos
  const junkWords = [
    'clipe oficial', 'vídeo oficial', 'video oficial', 'ao vivo', 'dvd', 'feat', 'ft.', 'letra', 
    'acústico', 'oficial', 'álbum completo', 'cd completo', 'lyric', 'audio', 'áudio', 'hd', '4k'
  ];
  junkWords.forEach(junk => {
    const reg = new RegExp(`\\b${junk}\\b`, 'gi');
    cleaned = cleaned.replace(reg, '');
  });

  // 5. Limpar caracteres não-alfanuméricos isolados ou sobrando
  cleaned = cleaned.replace(/[-|/:\\]/g, ' ').replace(/\s+/g, ' ').trim();

  // 6. Remover aspas residuais
  cleaned = cleaned.replace(/['"]/g, '');

  return cleaned || title;
};

let modifiedCount = 0;

songs.forEach(song => {
  const original = song.title;
  song.title = cleanTitle(song.title, song.artist);
  if (original !== song.title) {
    modifiedCount++;
    console.log(`DE:   ${original}\nPARA: ${song.title}\n`);
  }
});

fs.writeFileSync(songsPath, JSON.stringify(songs, null, 4));
console.log(`\nLimpeza concluída! ${modifiedCount} títulos foram formatados e corrigidos.`);
