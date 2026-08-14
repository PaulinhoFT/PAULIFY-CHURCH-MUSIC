# 🎧 Paulify

**Paulify** é uma aplicação web moderna de streaming de música focada em proporcionar a melhor experiência de adoração, com um catálogo voltado exclusivamente para músicas do cenário gospel e de igreja. Inspirado na interface das maiores plataformas do mercado (como Spotify e Deezer), o Paulify oferece um ambiente limpo, fluido e totalmente responsivo para você escutar seus louvores favoritos.

## ✨ Funcionalidades

- **Página Inicial Dinâmica (Descubra):** Carrosséis interativos, banner de destaque automático com transições em *fade* e seções personalizadas (Recomendados para Você, Mais Tocadas, Cantores).
- **Player Flutuante (Glassmorphism):** Um reprodutor de áudio persistente e flutuante que toca músicas em segundo plano enquanto você navega pelas abas.
- **Modo Tela Cheia (Modal Expandido):** Ao clicar na capa da música em reprodução, o player se expande para ocupar a tela, exibindo controles avançados, barra de progresso em tempo real e um elegante fundo com efeito de vidro opaco (blur).
- **Catálogo Inteligente:** Filtros por cantores (Colo de Deus, Morada, Ton Carfi, etc.), ordem alfabética e extração automática de metadados das músicas.
- **Design Premium:** Paleta de cores exclusiva e cuidadosamente elaborada, animações de *hover*, navegação sem rolagem aparente (clean UI) e ícones vetorizados modernos (`lucide-react`).

## 🚀 Tecnologias Utilizadas

Este projeto foi construído utilizando as melhores e mais modernas ferramentas do ecossistema front-end:

- **React.js:** Biblioteca principal para a criação das interfaces de usuário e controle de estados complexos (hooks).
- **Vite:** *Bundler* de altíssima performance usado para servir a aplicação durante o desenvolvimento.
- **CSS3 Vanilla / CSS Variables:** Estilização puramente nativa, responsiva, com variáveis CSS globais (sem dependência de frameworks externos como Tailwind), garantindo total controle sobre cada animação e pixel.
- **Lucide React:** Biblioteca de ícones vetoriais modernos.
- **Python (Scripts Auxiliares):** Utilizado para automatizar o *web scraping* e *fetching* via APIs externas (Deezer API, iTunes API) visando popular o banco de imagens dos artistas e as capas dos álbuns com a máxima qualidade visual.

## 🛠️ Como executar o projeto localmente

1. Faça o clone deste repositório:
   ```bash
   git clone https://github.com/SEU_USUARIO/paulify.git
   ```
2. Navegue até a pasta do projeto:
   ```bash
   cd paulify/paulify-web
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
5. Acesse `http://localhost:5173` no seu navegador.

---
Feito com dedicação para proporcionar os melhores momentos de adoração! 🙏
