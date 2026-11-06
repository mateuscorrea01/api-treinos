const bcrypt = require('bcrypt');
// Ajustado para apontar para o nome correto do seu arquivo: usuarios.js
const usuariosRepository = require('../repositories/usuarios.js');

async function login(usuarioDigitado, senhaDigitada) {
    const usuario = usuariosRepository.buscarPorUsuario(usuarioDigitado);
    
    if (!usuario) {
        return { invalido: true };
    }

    const senhaCorreta = await bcrypt.compare(senhaDigitada, usuario.senha_hash);

    if (!senhaCorreta) {
        return { invalido: true };
    }

    return { invalido: false, usuario: usuario };
}

module.exports = {
    login
};
