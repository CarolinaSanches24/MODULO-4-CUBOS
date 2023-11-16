const express = require("express");

const { cadastrarUsuario, listarUsuarios } = require("../controllers/usuario");

const validarCorpoRequisicao = require("../middlewares/validarCorpoRequisicao");
const schemaUsuario = require("../schemas/SchemaUsuario");

const routes = express.Router();

routes.post(
  "/usuario",
  validarCorpoRequisicao(schemaUsuario),
  cadastrarUsuario
);
routes.get("/usuarios", listarUsuarios);
module.exports = routes;
