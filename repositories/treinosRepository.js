const db = require('../banco.js');

// Método antigo (provavelmente de treinos)
function listarTodos() {
    return db.prepare('SELECT * FROM treinos').all();
}

// Usado internamente pelo login (traz o senha_hash)
function buscarPorUsuario(usuario) {
    return db
        .prepare('SELECT * FROM usuarios WHERE usuario = ?')
        .get(usuario);
}

// Usado para respostas públicas (segurança: não traz a senha)
function buscarPorId(id) {
    return db
        .prepare('SELECT id, usuario FROM usuarios WHERE id = ?')
        .get(id);
}

// EXPORTAÇÃO: Necessária para que o Service e o Controller consigam achar as funções!
module.exports = {
    listarTodos,
    buscarPorUsuario,
    buscarPorId
};
