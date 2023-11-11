const knex = require("../config/conection");

const newPost = async (req, res) => {
  const { id } = req.usuario;
  const { texto, fotos } = req.body;

  if (!fotos || fotos.length === 0) {
    return res.status(404).json("É preciso informar ao menos uma foto");
  }
  try {
    const post = await knex("postagens")
      .insert({
        texto,
        usuario_id: id,
      })
      .returning("*");
    if (!post) {
      return res.status(400).json("Não foi possível concluir a postagem");
    }
    for (const foto of fotos) {
      foto.postagem_id = post[0].id;
    }
    console.log(post[0].id);
    const fotosCadastradas = await knex("postagens_fotos").insert(fotos);

    if (!fotosCadastradas) {
      await knex("postagens").where({ id: post[0].id }).del();
      return res.status(400).json("Não foi possível concluir a postagem");
    }
    return res.status(200).json("Postagem realizada com sucesso!");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const curtir = async (req, res) => {
  const { id } = req.usuario; // id do usuario logado
  const { postId } = req.params;

  try {
    //verificar se a postagem existe
    const post = await knex("postagens").where({ id: postId }).first();
    console.log(post);
    if (!post) {
      return res.status(404).json("Postagem não encontrada");
    }
    // Verificar se a postagem já foi curtida

    const jaCurtiu = await knex("postagem_curtidas")
      .where({
        usuario_id: id,
        postagem_id: postId,
      })
      .first();

    if (jaCurtiu) {
      return res.status(400).json("Usuário já curtiu essa postagem");
    }
    const curtida = await knex("postagem_curtidas").insert({
      usuario_id: id,
      postagem_id: post.id,
    });

    if (!curtida) {
      return res.status(400).json("Não foi possível curtir essa postagem");
    }
    return res.status(200).json("Postagem curtida com sucesso!");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const comentar = async (req, res) => {
  const { id } = req.usuario; // id do usuario logado
  const { postId } = req.params;
  const { texto } = req.body;

  if (!texto) {
    return res
      .status(400)
      .json("Para comentar nessa postagem e necessário texto!");
  }

  try {
    //verificar se a postagem existe
    const postagem = await knex("postagens").where({ id: postId }).first();

    if (!postagem) {
      return res.status(404).json("Postagem não encontrada");
    }

    const comentario = await knex("postagem_comentarios").insert({
      texto,
      usuario_id: id,
      postagem_id: postId,
    });
    if (!comentario) {
      return res.status(400).json("Não foi possível comentar nessa postagem");
    }
    return res.status(200).json("Postagem comentada com sucesso!");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const feed = async (req, res) => {
  const { id } = req.usuario;
  const { offset } = req.query;

  const o = offset ? offset : 0;

  try {
    const postagens = await knex("postagens")
      .where("usuario_id", "!=", id)
      .limit(10)
      .offset(o);
    if (postagens.length === 0) {
      return res.status(200).json(postagens);
    }
    for (const postagem of postagens) {
      //usuario
      const usuario = await knex("usuarios")
        .where({ id: postagem.usuario_id })
        .select("imagem", "username", "verificado")
        .first();
      postagem.usuario = usuario;
      //fotos
      const fotos = await knex("postagens_fotos")
        .where({ postagem_id: postagem.id })
        .select("imagem");
      postagem.fotos = fotos;

      //curtidas
      const curtidas = await knex("postagem_curtidas")
        .where({ postagem_id: postagem.id })
        .select("usuario_id");
      postagem.curtidas = curtidas.length;

      // curtido por mim
      postagem.curtidoPorMim = curtidas.find(
        (curtida) => curtida.usuario_id === id
      )
        ? true
        : false;

      //comentarios
      const comentarios = await knex("postagem_comentarios")
        .leftJoin("usuarios", "usuarios.id", "postagem_comentarios.usuario_id")
        .where({ postagem_id: postagem.id })
        .select("usuarios.username", "postagem_comentarios.texto");
      postagem.comentarios = comentarios;
    }
    return res.status(200).json(postagens);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};
module.exports = {
  newPost,
  curtir,
  comentar,
  feed,
};
