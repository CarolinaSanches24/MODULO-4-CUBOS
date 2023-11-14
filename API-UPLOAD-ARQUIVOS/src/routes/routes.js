const express = require("express");
const {
  sendFile,
  listFiles,
  sendFiles,
  deleteFile,
} = require("../controllers/files");

const multer = require("../middlewares/multer");

const routes = express.Router();

routes.post("/upload", multer.single("arquivo"), sendFile);
routes.post("/uploadArquivos", multer.array("arquivo"), sendFiles);
routes.get("/arquivos", listFiles);
routes.delete("/arquivo", deleteFile);

module.exports = routes;
