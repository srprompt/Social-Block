import { db } from "../conexao.js";
import jwt from "jsonwebtoken";

export const getLikes = (req,res)=>{
    const q = "SELECT usuarioId FROM socialblock.like WHERE postId = ?";

    db.query(q, [req.query.postId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data.map(like=>like.usuarioId));
    });
}

export const addLike = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Usuário não autenticado!");
  
    jwt.verify(token, "secretkey", (err, userInfo) => {
      if (err) return res.status(403).json("Token inválido!");
  
      const q = "INSERT INTO socialblock.like (`usuarioId`,`postId`) VALUES (?)";
      const values = [
        userInfo.id,
        req.body.postId
      ];
  
      db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Post curtido com sucesso.");
      });
    });
  };
  
  export const deleteLike = (req, res) => {
  
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Usuário não autenticado!");
  
    jwt.verify(token, "secretkey", (err, userInfo) => {
      if (err) return res.status(403).json("Token inválido!");
  
      const q = "DELETE FROM socialblock.like WHERE `usuarioId` = ? AND `postId` = ?";
  
      db.query(q, [userInfo.id, req.query.postId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Post descurtido com sucesso.");
      });
    });
  };