const knex = require("../config/connectionDB");
const validarCampos = async (req, res, next) => {
  const { nome, email, senha } = req.body;
  try {
    if (!nome || !email || !senha) {
      return res.status(400).json({
        erro: "Todos os campos são obrigatórios: nome, email e senha.",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do Servidor!" });
  }
};

const validarUsuario = async (req, res, next) => {
  const { id } = req.params;
  try {
    const usuario = await knex("usuarios").where({ id }).first();
    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do Servidor!" });
  }
};
module.exports = {
  validarCampos,
  validarUsuario,
};
