const express = require('express');
const { DatabaseSync } = require('node:sqlite');

const app = express();
app.use(express.json());

const db = new DatabaseSync('treinos.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS treinos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    duracao INTEGER NOT NULL
  )
`);

function validarTreino(corpo) {
  if (typeof corpo.nome !== 'string' || corpo.nome.trim() === '') return 'O campo nome e obrigatorio e deve ser um texto .!';
  if (typeof corpo.duracao !== 'number' || corpo.duracao <= 0) {
    return 'O campo duracao e obrigatorio e deve ser um numero maior que zero .';
  }
  return null;
}

// GET /treinos
app.get('/treinos', (req, res) => {
  const treinos = db.prepare('SELECT * FROM treinos').all();
  res.status(200).json(treinos);
});

// GET /treinos/:id
app.get('/treinos/:id', (req, res) => {
  const id = Number(req.params.id);
  const treino = db.prepare('SELECT * FROM treinos WHERE id = ?').get(id);

  if (treino === undefined) {
    return res.status(404).json({ erro: 'Treino nao encontrado .' });
  }
  res.status(200).json(treino);
});

// POST /treinos
app.post('/treinos', (req, res) => {
  const listaTreinos = Array.isArray(req.body) ? req.body : [req.body];
  const resultados = [];

  for (const t of listaTreinos) {
    const erro = validarTreino(t);
    if (erro !== null) {
      return res.status(400).json({ erro: `Erro no treino: ${erro}` });
    }
  }

  const insertComId = db.prepare('INSERT INTO treinos (id, nome, duracao) VALUES (?, ?, ?)');
  const insertSemId = db.prepare('INSERT INTO treinos (nome, duracao) VALUES (?, ?)');
  const buscarTreino = db.prepare('SELECT * FROM treinos WHERE id = ?');

  for (const t of listaTreinos) {
    let idGerado;

    if (t.id) {
      insertComId.run(t.id, t.nome, t.duracao);
      idGerado = t.id;
    } else {
      const resultado = insertSemId.run(t.nome, t.duracao);
      idGerado = resultado.lastInsertRowid;
    }

    const novoTreino = buscarTreino.get(idGerado);
    resultados.push(novoTreino);
  }

  res.status(201).json(Array.isArray(req.body) ? resultados : resultados[0]);
});

// PUT /treinos/:id
app.put('/treinos/:id', (req, res) => {
  const id = Number(req.params.id);

  const erro = validarTreino(req.body);
  if (erro !== null) {
    return res.status(400).json({ erro: erro });
  }

  const treinoExistente = db.prepare('SELECT * FROM treinos WHERE id = ?').get(id);
  if (treinoExistente === undefined) {
    return res.status(404).json({ erro: 'Treino nao encontrado.' });
  }

  db.prepare('UPDATE treinos SET nome = ?, duracao = ? WHERE id = ?')
    .run(req.body.nome, req.body.duracao, id);

  const atualizado = db.prepare('SELECT * FROM treinos WHERE id = ?').get(id);
  res.status(200).json(atualizado);
});

// DELETE /treinos/:id
app.delete('/treinos/:id', (req, res) => {
  const id = Number(req.params.id);
  const treino = db.prepare('SELECT * FROM treinos WHERE id = ?').get(id);
  
  if (treino === undefined) {
    return res.status(404).json({ erro: 'Treino nao encontrado.' });
  }

  db.prepare('DELETE FROM treinos WHERE id = ?').run(id);
  res.status(204).end();
});

const PORTA = 3000;
app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
