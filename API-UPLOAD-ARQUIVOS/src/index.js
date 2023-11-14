require("dotenv").config();
const express = require("express");
const routes = require("./routes/routes");

const server = express();
server.use(express.json());
server.use(routes);
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Servidor ouvindo a porta ${PORT}`);
});
