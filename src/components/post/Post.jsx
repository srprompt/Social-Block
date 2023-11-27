import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useState } from "react";
import moment from "moment";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const { isPending, error, data } = useQuery({queryKey: ['likes', post.id], queryFn: () =>
      makeRequest.get("/like?postId=" + post.id).then((res) => {
        return res.data;
      })
  });
  
  const { data2 } = useQuery({queryKey: ['comments'], queryFn: () =>
      makeRequest.get("https://coral-app-xcxp2.ondigitalocean.app/api/comentario?postId=" + post.id).then((res) => {
        return res.data;
      })
  });


  const queryClient = useQueryClient()

    const mutation = useMutation({
    mutationFn: (liked)=>{
      if (liked) return makeRequest.delete("/like?postId=" + post.id);
      return makeRequest.post("/like", { postId: post.id });
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(["likes"]);
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: (postId)=>{
      return makeRequest.delete("/post/" + postId);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(["posts"]);
    },
  });
  

  const handleLike = () => {
    mutation.mutate(data.includes(currentUser.id));
  };

  const handleDelete = () => {
    deleteMutation.mutate(post.id);
  };

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img
                src={post.fotoPerfil ? `/upload/${post.fotoPerfil}` : 'https://cdn.discordapp.com/attachments/897543119078322176/1178345420011876412/registro-sb.jpg?ex=6575ceb0&is=656359b0&hm=fb5741d4a6575d03345320714bd5ac772d8ff4b59dc28a2b1e0262f75be8157a&'}
                alt=""
                className="postUserImage"
              />
            <div className="details">
              <Link
                to={`/profile/${post.usuarioId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.nome}</span>
              </Link>
              <span className="date">{moment(post.criadoEm).locale('pt-br').fromNow()}</span>
            </div>
          </div>
          <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />
          {menuOpen && post.usuarioId === currentUser.id && (
            <button onClick={handleDelete}>Deletar</button>
          )}
        </div>
        <div className="content">
          <p>{post.descricao}</p>
          <img src={"./upload/" + post.img} alt="" />
          {post.video && (
          <center><video src={"./upload/" + post.video} id="meuVideo" width="500" height="500" controls>
          Seu navegador não suporta o elemento de vídeo.
          </video></center>
          )}
        </div>
        <div className="info">
          <div className="item">
            {isPending ? (
              "Carregando..."
            ) : data.includes(currentUser.id) ? (
              <BlockOutlinedIcon
                style={{ color: "red" }}
                onClick={handleLike}
              />
            ) : (
              <BlockOutlinedIcon onClick={handleLike}/>
            )}
            {data?.length} Block (s)	
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            {data2?.length} Comentários
          </div>
        </div>
        {commentOpen && <Comments postId = {post.id}/>}
      </div>
    </div>
  );
};

export default Post;
