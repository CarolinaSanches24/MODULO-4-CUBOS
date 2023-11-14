const s3 = require("../config/connectionAWS");
const sendFile = async (req, res) => {
  const { file } = req;
  try {
    const arquivo = await s3
      .upload({
        Bucket: process.env.BACKBLAZE_BUCKET,
        Key: `imagens/${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
      .promise();
    return res.json({
      url: arquivo.Location,
      path: arquivo.Key,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const sendFiles = async (req, res) => {
  const { files } = req;
  try {
    const result = [];
    for (const file of files) {
      const arquivo = await s3
        .upload({
          Bucket: process.env.BACKBLAZE_BUCKET,
          Key: `imagens/multiplas/${file.originalname}`,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
        .promise();
      result.push({
        url: arquivo.Location,
        path: arquivo.Key,
      });
    }
    return res.json(result);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
const listFiles = async (req, res) => {
  try {
    const files = await s3
      .listObjects({
        Bucket: process.env.BACKBLAZE_BUCKET,
      })
      .promise();
    const arquivos = files.Contents.map((file) => {
      return {
        url: `https://${process.env.BACKBLAZE_BUCKET}.${process.env.ENDPOINT_S3}/${file.Key}`,
        path: file.Key,
      };
    });
    return res.status(200).json(arquivos);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const deleteFile = async (req, res) => {
  const { file } = req.query;
  try {
    await s3
      .deleteObject({
        Bucket: process.env.BACKBLAZE_BUCKET,
        Key: file,
      })
      .promise();
    return res.status(204).json();
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
module.exports = {
  sendFile,
  sendFiles,
  listFiles,
  deleteFile,
};
