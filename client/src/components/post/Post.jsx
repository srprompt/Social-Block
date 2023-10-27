import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
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
            <img src={post.fotoPerfil} alt="" />
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
            <button onClick={handleDelete}>delete</button>
          )}
        </div>
        <div className="content">
          <p>{post.descricao}</p>
          <img src={"./upload/" + post.img} alt="" />
        </div>
        <div className="info">
          <div className="item">
            {isPending ? (
              "Carregando..."
            ) : data.includes(currentUser.id) ? (
              <FavoriteOutlinedIcon
                style={{ color: "red" }}
                onClick={handleLike}
              />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={handleLike}/>
            )}
            {data?.length} Likes	
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            12 Comentários
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Compartilhar
          </div>
        </div>
        {commentOpen && <Comments postId = {post.id}/>}
      </div>
    </div>
  );
};

export default Post;
