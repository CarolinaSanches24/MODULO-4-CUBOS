const express = require("express");
const {
  listarUsuarios,
  cadastrarUsuario,
  obterRegistro,
} = require("../controllers/users");

const routes = express();

routes.get("/usuarios", listarUsuarios);
routes.get("/usuarios/:id", obterRegistro);
routes.post("/usuarios", cadastrarUsuario);

module.exports = routes;
