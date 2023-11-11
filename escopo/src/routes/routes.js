const express = require("express");
const usuarios = require("../controllers/users");
const login = require("../controllers/login");
const verifyLogin = require("../middlewares/verifyLogin");
const postagens = require("../controllers/postagens");

const routes = express();

// cadastro de usuario
routes.post("/register", usuarios.registerUser);
// login
routes.post("/login", login);
// filtro verificar usuario logado
routes.use(verifyLogin);
//obter e atualizar perfil usuario logado
routes.get("/profile", usuarios.search);
routes.put("/profile", usuarios.updateProfile);

//rotas de postagens
routes.post("/registerPost", postagens.newPost);
routes.post("/likePost/:postId", postagens.curtir);
routes.post("/commentPost/:postId", postagens.comentar);
routes.get("/postagens/feed", postagens.feed);

module.exports = routes;
