import { db } from "../conexao.js";
import jwt from "jsonwebtoken";

export const getRelationship = (req,res)=>{
    const q = "SELECT followerUsuarioId FROM relacionamento WHERE followedUsuarioId = ?";

    db.query(q, [req.query.followedUsuarioId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data.map(relationship=>relationship.followerUsuarioId));
    });
}

export const addRelationship = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Usuário não autenticado!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token não é válido!");

    const q = "INSERT INTO relacionamento (`followerUsuarioId`,`followedUsuarioId`) VALUES (?)";
    const values = [
      userInfo.id,
      req.body.usuarioId
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Seguindo");
    });
  });
};

export const deleteRelationship = (req, res) => {

  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Usuario não autenticado!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token não é válido!");

    const q = "DELETE FROM relacionamento WHERE `followerUsuarioId` = ? AND `followedUsuarioId` = ?";

    db.query(q, [userInfo.id, req.query.usuarioId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Parou de seguir");
    });
  });
};