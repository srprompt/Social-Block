import { db } from "../conexao.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res)=>{
    //CHECA SE O USUARIO EXISTE
    const q = "SELECT * FROM usuario WHERE username = ?";

    db.query(q, [req.body.username], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length) return res.status(409).json("Usuario já existe!");
        //CRIA O USUARIO
            //HASH NA SENHA
            const salt = bcrypt.genSaltSync(10);
            const hashedSenha = bcrypt.hashSync(req.body.senha, salt);

            const q = "INSERT INTO usuario (`username`, `email`, `senha`, `nome`) VALUE (?)";

            const valores = [
                req.body.username, 
                req.body.email, 
                hashedSenha, 
                req.body.nome
            ];

            db.query(q, [valores], (err, data) => {
                if (err) return res.status(500).json(err);
                return res.status(200).json("Usuario criado com sucesso!");
            });
    });
};

export const login = (req, res) => {
    const q = "SELECT * FROM usuario WHERE username = ?";

    db.query(q, [req.body.username], (err, data) => {
        if (err) return res.status(500).json(err);
        if(data.length === 0) return res.status(404).json("Usuario não encontrado!");

        const senhaValida = bcrypt.compareSync(
            req.body.senha, 
            data[0].senha
        );

        if(!senhaValida) 
            return res.status(400).json("Usuario ou Senha incorreto(s)!");

        const token = jwt.sign({id: data[0].id}, "secretkey");

        const { senha, ...others } = data[0];

        res
            .cookie("accessToken", token, {
                httpOnly: true,
        })
        .status(200)
        .json(others);
    });
};

export const logout = (req, res) => {
    res.clearCookie("accessToken",{
      secure:true,
      sameSite:"none"
    }).status(200).json("Usuário deslogado.")
  };