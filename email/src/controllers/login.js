const compiladorHtml = require("../utils/compiladorHtml");
const transportador = require("./email");

const usuario = {
  nome: "Guido Cubos",
  email: "carolina@gmail.com",
  senha: "123abs",
};

const login = async (req, res) => {
  const { email, senha } = req.body;

  if (usuario.email !== email || usuario.senha !== senha) {
    return res.status(400).json({ mensagem: "Email ou senha inválidos" });
  }

  const html = await compiladorHtml("./src/templates/login.html", {
    nomeusuario: usuario.nome,
  });
  //   console.log(arquivo.toString())
  transportador.sendMail({
    from: `${process.env.EMAIL_NAME} <${process.env.EMAIL_FROM}>`,
    to: `${usuario.nome} <${usuario.email}>`,
    subject: "Tentativa de Login",
    html,
  });
  return res.json({ mensagem: "Login efetuado com sucesso" });
};
module.exports = {
  login,
};
