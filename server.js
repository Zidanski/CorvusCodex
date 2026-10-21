// Servidor local do Corvus Codex.
// Ele só entrega os arquivos do site (HTML, CSS, JS, imagens) para o navegador.
// Para rodar: npm start  →  abra http://localhost:3000

const path = require('path');
const express = require('express');

const app = express();
const PORTA = process.env.PORT || 3000;
const PASTA_DO_SITE = __dirname;

function paginaNaoEncontrada(req, res) {
  res.status(404).sendFile(path.join(PASTA_DO_SITE, '404.html'));
}

// "/" abre a página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(PASTA_DO_SITE, 'landing.html'));
});

// Arquivos internos do projeto não fazem parte do site
app.use(['/node_modules', '/server.js', '/package.json', '/package-lock.json'], paginaNaoEncontrada);

// Entrega os arquivos estáticos (pesquisa.html, css/tokens.css, js/tema.js...)
app.use(express.static(PASTA_DO_SITE, { index: false, dotfiles: 'ignore' }));

// Se nada acima respondeu, a página não existe: mostra o 404 em português
app.use(paginaNaoEncontrada);

app.listen(PORTA, () => {
  console.log(`Corvus Codex rodando em http://localhost:${PORTA}`);
});
