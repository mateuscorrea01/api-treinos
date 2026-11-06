const service = require('../services/authService.js');
const sessoes = require('../sessoes.js');
const usuariosRepository = require('../repositories/usuarios.js');

// --- SUA FUNÇÃO LOGIN ORIGINAL (MANTIDA 100% IGUAL) ---
async function login(req, res) {
    const usuario = (req.body.usuario ?? '').trim();
    const senha = req.body.senha ?? '';
    const resultado = await service.login(usuario, senha);
    if (resultado.invalido === true) {
        return res.status(401).json({
            erro: 'Usuario ou senha invalidos.'
        });
    }
    const token = sessoes.criar(resultado.usuario.id);
    res.cookie('sid', token, { httpOnly: true });
    res.status(200).json(resultado.usuario);
}

// --- FUNÇÃO PERFIL AJUSTADA COM O SEU PADRÃO ---
function perfil(req, res) {
    const cookieSid = req.cookies?.sid; 
    // Usando o seu método correto do sessoes.js:
    const usuarioId = sessoes.usuarioIdDaSessao(cookieSid); 

    if (!usuarioId) {
        return res.status(401).json({ erro: 'Não autenticado.' });
    }

    const usuario = usuariosRepository.buscarPorId(usuarioId);
    return res.status(200).json(usuario);
}

// --- FUNÇÃO LOGOUT AJUSTADA COM O SEU PADRÃO ---
function logout(req, res) {
    const cookieSid = req.cookies?.sid;
    // Usando o seu método correto do sessoes.js:
    sessoes.encerrar(cookieSid); 
    res.clearCookie('sid'); 
    return res.status(200).json({ mensagem: 'Logout efetuado com sucesso.' });
}

module.exports = {
    login,
    perfil,
    logout
};
