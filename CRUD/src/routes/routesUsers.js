const express = require("express");
const {
  listarUsuarios,
  cadastrarUsuario,
  obterRegistro,
  atualizarUsuario,
  excluir,
} = require("../controllers/users");
const { validarCampos, validarUsuario } = require("../middlewares/users");
const routes = express();

routes.get("/usuarios", listarUsuarios);
routes.get("/usuarios/:id", validarUsuario, obterRegistro);
routes.post("/usuarios", validarCampos, cadastrarUsuario);
routes.put("/usuarios/:id", validarUsuario, atualizarUsuario);
routes.delete("/usuarios/:id", validarUsuario, excluir);
module.exports = routes;
