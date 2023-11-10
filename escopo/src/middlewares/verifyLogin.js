const knex = require("../config/conection");
const jwt = require("jsonwebtoken");

const verifyLogin = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json("Não autorizado");
  }
  try {
    const token = authorization.replace("Bearer", "").trim();

    const SECRET_KEY = process.env.SECRET_KEY;
    const { id } = jwt.verify(token, SECRET_KEY);

    const userExists = await knex("usuarios").where({ id }).first();

    if (!userExists) {
      return res.status(404).json("Token Inválido");
    }

    const { senha, ...usuario } = userExists;

    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = verifyLogin;
