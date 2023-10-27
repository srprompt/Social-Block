import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";
import 'moment/locale/pt-br' 

const Comments = ({ postId }) => {
  const [descricao, setDesc] = useState("");
  const { currentUser } = useContext(AuthContext);

  const { isPending, error, data } = useQuery({queryKey: ['comments'], queryFn: () =>
      makeRequest.get("/comentario?postId=" + postId).then((res) => {
        return res.data;
      })
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newComment)=>{
      return makeRequest.post('/comentario', newComment);
    },
      onSuccess: () => {
      // Invalidate and refetch
        queryClient.invalidateQueries(["comments"]);
      },
  }
);

  const handleClick = async (e) => {
    e.preventDefault();
    mutation.mutate({ descricao, postId });
    setDesc("");
  };

  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.fotoPerfil} alt="" />
        <input
          type="text"
          placeholder="comente algo"
          value={descricao}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={handleClick}>Comentar</button>
      </div>
      {error
        ? "Algo deu errado!"
        : isPending
        ? "Carregando..."
        : data.map((comment) => (
            <div className="comment">
              <img src={comment.fotoPerfil} alt="" />
              <div className="info">
                <span>{comment.nome}</span>
                <p>{comment.descricao}</p>
              </div>
              <span className="date">
                {moment(comment.criadoEm).locale('pt-br').fromNow()}
              </span>
            </div>
          ))}
    </div>
  );
};

export default Comments;