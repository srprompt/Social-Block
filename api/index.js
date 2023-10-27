import express from 'express';
const app = express();

import userRoutes from './routes/usuario.js';
import autenticacaoRoutes from './routes/autenticacao.js';
import postRoutes from './routes/post.js';
import comentarioRoutes from './routes/comentario.js';
import likeRoutes from './routes/like.js';
import relacionamentoRoutes from './routes/relacionamento.js';
import cors from 'cors';
import multer from 'multer';
import cookieParser from 'cookie-parser';

//middlewares
app.use((req,res,next) => {
  res.header("Access-Control-Allow-Credentials", true)
  next()
});
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../client/public/upload')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage })

app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

app.use("/api/usuario", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comentario", comentarioRoutes);
app.use("/api/like", likeRoutes);
app.use("/api/autenticacao", autenticacaoRoutes);
app.use("/api/relacionamento", relacionamentoRoutes);

app.listen(8800, () => {
  console.log('API WORKING! 🚀');
});