require("dotenv").config();
const express = require("express");
const { login } = require("./controllers/login");
const app = express();

app.use(express.json());

app.post("/login", login);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Servidor ouvindo a porta ${PORT}`);
});
