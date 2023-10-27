import {db} from "../conexao.js"
import jwt from "jsonwebtoken";
import moment from "moment";

export const getPosts = (req, res) => {

    const usuarioId = req.query.usuarioId;
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Usuário não autenticado!")

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if(err) return res.status(403).json("Token não é válido!");
        
        const q =
        usuarioId !== "undefined"
          ? `SELECT p.*, u.id AS usuarioId, nome, fotoPerfil FROM post AS p JOIN usuario AS u ON (u.id = p.usuarioId) WHERE p.usuarioId = ? ORDER BY p.criadoEm DESC`
          : `SELECT p.*, u.id AS usuarioId, nome, fotoPerfil FROM post AS p JOIN usuario AS u ON (u.id = p.usuarioId)
      LEFT JOIN relacionamento AS r ON (p.usuarioId = r.followedUsuarioId) WHERE r.followerUsuarioId= ? OR p.usuarioId =?
      ORDER BY p.criadoEm DESC`;
  
      const values =
        usuarioId !== "undefined" ? [usuarioId] : [userInfo.id, userInfo.id];
  
      db.query(q, values, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
      });
    });
  };

export const addPost = (req, res) => {
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Usuário não autenticado!")

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if(err) return res.status(403).json("Token não é válido!");
  
        const q = "INSERT INTO post(`descricao`, `img`, `criadoEm`, `usuarioId`) VALUES (?)";
        
        const values = [
            req.body.descricao,
            req.body.img,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            userInfo.id,
        ];
    
        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Post criado.");
        });
    });
  };

  export const deletePost = (req, res) => {
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Usuário não autenticado!")

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if(err) return res.status(403).json("Token não é válido!");
  
        const q = "DELETE FROM post WHERE `id`= ? AND `usuarioId` = ?";
    
        db.query(q, [req.params.id, userInfo.id], (err, data) => {
            if (err) return res.status(500).json(err);
            if(data.affectedRows>0) return res.status(200).json("Post removido.");
            return res.status(403).json("Você não tem permissão para remover esse post.")
        });
    });
  };