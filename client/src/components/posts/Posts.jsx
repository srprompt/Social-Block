import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from '@tanstack/react-query'
import { makeRequest } from "../../axios";

const Posts = ({usuarioId}) => {

  const { isPending, error, data } = useQuery({queryKey: ['posts'], queryFn: () =>
      makeRequest.get("/post?usuarioId="+usuarioId).then((res) => {
        return res.data;
      })
  });

  console.log(data);

  return (
    <div className="posts">
      {error ? "Algo deu errado!" 
        : isPending
        ? "Carregando..."
        : data.map((post)=> <Post post={post} key={post.id} />)}
    </div>
  );
};

export default Posts;
