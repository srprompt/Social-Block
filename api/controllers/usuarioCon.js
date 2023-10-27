import { db } from "../conexao.js";
import jwt from "jsonwebtoken";

export const getUser = (req, res) => {
  const usuarioId = req.params.usuarioId;
  const q = "SELECT * FROM usuario WHERE id=?";

  db.query(q, [usuarioId], (err, data) => {
    if (err) return res.status(500).json(err);
    const { senha, ...info } = data[0];
    return res.json(info);
  });
};

export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Usuário não autenticado!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token inválido!");

    const q =
      "UPDATE usuario SET `nome`=?,`cidade`=?,`website`=?,`fotoPerfil`=?,`fotoCapa`=? WHERE id=? ";

    db.query(
      q,
      [
        req.body.nome,
        req.body.cidade,
        req.body.website,
        req.body.fotoCapa,
        req.body.fotoPerfil,
        userInfo.id
      ],
      (err, data) => {
        if (err) res.status(500).json(err);
        if (data.affectedRows > 0) return res.json("Atualizado com sucesso!");
        return res.status(403).json("Você não tem permissão para isso!");
      }
    );
  });
};