// Servidor local do Corvus Codex.
// Ele faz duas coisas:
//   1) entrega os arquivos do site (HTML, CSS, JS) para o navegador;
//   2) tem uma pequena API (/api/...) que lê e grava os materiais e comentários.
// Para rodar: npm start  →  abra http://localhost:3000

const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const PORTA = process.env.PORT || 3000;
const PASTA_DO_SITE = __dirname;

// ===== "Banco de dados" em arquivo JSON =====
// data/materiais-exemplo.json → dados fictícios iniciais (vão para o Git)
// data/banco.json             → cópia que o site altera (fica FORA do Git)
const ARQUIVO_EXEMPLO = path.join(PASTA_DO_SITE, 'data', 'materiais-exemplo.json');
const ARQUIVO_BANCO = path.join(PASTA_DO_SITE, 'data', 'banco.json');

if (!fs.existsSync(ARQUIVO_BANCO)) {
  fs.copyFileSync(ARQUIVO_EXEMPLO, ARQUIVO_BANCO);
}
const banco = JSON.parse(fs.readFileSync(ARQUIVO_BANCO, 'utf8'));

function salvarBanco() {
  fs.writeFileSync(ARQUIVO_BANCO, JSON.stringify(banco, null, 2));
}

function proximoId(lista) {
  return lista.reduce((maior, item) => Math.max(maior, item.id), 0) + 1;
}

// Opções fixas dos campos "tipo" e "disciplina"
const TIPOS = ['Livro', 'Resumo', 'Apostila', 'Anotação', 'Exercícios'];
const DISCIPLINAS = [
  'Algoritmos e Programação',
  'Estruturas de Dados',
  'Banco de Dados',
  'Cálculo',
  'Redes de Computadores',
  'Engenharia de Software',
  'Compiladores',
  'Ética e Computação',
];

// Tira acentos e deixa minúsculo, para "calculo" achar "Cálculo"
function normalizar(texto) {
  return String(texto || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

// Lê um texto do formulário: tira espaços das pontas e corta no tamanho máximo
function texto(valor, maximo) {
  return String(valor || '').trim().slice(0, maximo);
}

function comResumo(material) {
  const totalComentarios = banco.comentarios.filter((c) => c.materialId === material.id).length;
  return { ...material, totalComentarios };
}

// ===== API =====
app.use(express.json({ limit: '50kb' }));

app.get('/api/opcoes', (req, res) => {
  res.json({ tipos: TIPOS, disciplinas: DISCIPLINAS });
});

// Lista (e pesquisa) materiais: /api/materiais?q=sql&tipo=Livro&disciplina=Banco%20de%20Dados
app.get('/api/materiais', (req, res) => {
  const busca = normalizar(req.query.q);
  const { tipo, disciplina } = req.query;

  const resultado = banco.materiais
    .filter((m) => !tipo || m.tipo === tipo)
    .filter((m) => !disciplina || m.disciplina === disciplina)
    .filter((m) => {
      if (!busca) return true;
      const ondeProcurar = [m.titulo, m.autor, m.disciplina, m.tipo, m.descricao, m.conteudo, m.tags.join(' ')];
      return normalizar(ondeProcurar.join(' ')).includes(busca);
    })
    .sort((a, b) => b.criadoEm.localeCompare(a.criadoEm))
    .map(comResumo);

  res.json(resultado);
});

app.get('/api/materiais/:id', (req, res) => {
  const id = Number(req.params.id);
  const material = banco.materiais.find((m) => m.id === id);
  if (!material) {
    return res.status(404).json({ erro: 'Material não encontrado.' });
  }
  const comentarios = banco.comentarios
    .filter((c) => c.materialId === id)
    .sort((a, b) => a.criadoEm.localeCompare(b.criadoEm));
  res.json({ ...material, comentarios });
});

// Enviar um material novo
app.post('/api/materiais', (req, res) => {
  const dados = req.body || {};
  const material = {
    id: proximoId(banco.materiais),
    titulo: texto(dados.titulo, 120),
    autor: texto(dados.autor, 120),
    ano: dados.ano ? Number(dados.ano) : null,
    tipo: texto(dados.tipo, 30),
    disciplina: texto(dados.disciplina, 60),
    descricao: texto(dados.descricao, 300),
    conteudo: texto(dados.conteudo, 5000),
    link: texto(dados.link, 300),
    tags: texto(dados.tags, 200).split(',').map((t) => t.trim().toLowerCase()).filter(Boolean).slice(0, 8),
    enviadoPor: texto(dados.enviadoPor, 60),
    criadoEm: new Date().toISOString(),
  };

  // A página já confere os campos, mas o servidor confere de novo (nunca confie só no navegador)
  if (!material.titulo || !material.autor || !material.descricao || !material.enviadoPor) {
    return res.status(400).json({ erro: 'Preencha título, autor, descrição e seu nome.' });
  }
  if (!TIPOS.includes(material.tipo) || !DISCIPLINAS.includes(material.disciplina)) {
    return res.status(400).json({ erro: 'Escolha um tipo e uma disciplina da lista.' });
  }
  if (material.ano !== null && (!Number.isInteger(material.ano) || material.ano < 1000 || material.ano > 2100)) {
    return res.status(400).json({ erro: 'O ano precisa ter 4 dígitos, como 2024.' });
  }
  if (material.link && !/^https?:\/\//i.test(material.link)) {
    return res.status(400).json({ erro: 'O link precisa começar com http:// ou https://.' });
  }

  banco.materiais.push(material);
  salvarBanco();
  res.status(201).json(material);
});

// Comentar em um material
app.post('/api/materiais/:id/comentarios', (req, res) => {
  const id = Number(req.params.id);
  if (!banco.materiais.some((m) => m.id === id)) {
    return res.status(404).json({ erro: 'Material não encontrado.' });
  }
  const comentario = {
    id: proximoId(banco.comentarios),
    materialId: id,
    nome: texto(req.body && req.body.nome, 60),
    texto: texto(req.body && req.body.texto, 1000),
    criadoEm: new Date().toISOString(),
  };
  if (!comentario.nome || !comentario.texto) {
    return res.status(400).json({ erro: 'Preencha seu nome e o comentário.' });
  }
  banco.comentarios.push(comentario);
  salvarBanco();
  res.status(201).json(comentario);
});

// Comentários mais recentes de todo o acervo
app.get('/api/comentarios', (req, res) => {
  const recentes = banco.comentarios
    .slice()
    .sort((a, b) => b.criadoEm.localeCompare(a.criadoEm))
    .slice(0, 30)
    .map((c) => {
      const material = banco.materiais.find((m) => m.id === c.materialId);
      return { ...c, materialTitulo: material ? material.titulo : 'Material removido' };
    });
  res.json(recentes);
});

// Endereço de API que não existe
app.use('/api', (req, res) => {
  res.status(404).json({ erro: 'Endereço da API não encontrado.' });
});

// ===== Páginas do site =====
function paginaNaoEncontrada(req, res) {
  res.status(404).sendFile(path.join(PASTA_DO_SITE, '404.html'));
}

// "/" abre a página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(PASTA_DO_SITE, 'landing.html'));
});

// Arquivos internos do projeto não fazem parte do site
app.use(['/node_modules', '/data', '/server.js', '/package.json', '/package-lock.json'], paginaNaoEncontrada);

// Entrega os arquivos estáticos (pesquisa.html, css/tokens.css, js/tema.js...)
app.use(express.static(PASTA_DO_SITE, { index: false, dotfiles: 'ignore' }));

// Se nada acima respondeu, a página não existe: mostra o 404 em português
app.use(paginaNaoEncontrada);

// Se algo deu errado (ex.: dados enviados com defeito), responde com uma mensagem em português
app.use((erro, req, res, next) => {
  console.error(erro.message);
  res.status(erro.status || 500).json({ erro: 'Não foi possível processar o pedido. Tente de novo.' });
});

app.listen(PORTA, () => {
  console.log(`Corvus Codex rodando em http://localhost:${PORTA}`);
});
