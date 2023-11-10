require("dotenv").config();
const express = require("express");
const routes = require("./routes/routes");
const cors = require("cors");

const server = express();

server.use(express.json());
server.use(cors());
server.use(routes);

const PORT = process.env.SERVER_PORT;
server.listen(PORT, () => {
  console.log(`Servidor está ouvindo na porta ${PORT}`);
});
