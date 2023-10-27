import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Share = () => {
  const [file, setFile] = useState(null);
  const [descricao, setDesc] = useState("");

  const upload = async () => {
    try{
      const formData = new FormData();
      formData.append("file", file)
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    }catch(err){
      console.log(err)
    }
  }

  const {currentUser} = useContext(AuthContext)

  const queryClient = useQueryClient()

    const mutation = useMutation({
    mutationFn: (newPost)=>{
      return makeRequest.post('/post', newPost);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(["posts"]);
    },
  });

  const handleClick = async (e) => {
    e.preventDefault();
    let imgUrl = "";
    if (file) imgUrl = await upload();
    mutation.mutate({descricao, img: imgUrl});
    setDesc("");
    setFile(null);
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            <img
              src={currentUser.fotoPerfil}
              alt=""
            />
            <input 
              type="text" 
              placeholder={`O que vem a sua mente ${currentUser.nome}?`}
              onChange={(e) => setDesc(e.target.value)}
              value = {descricao}
            />
            </div>
            <div className="right">
              {file && <img className="file" alt="" src={URL.createObjectURL(file)} />}
            </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input 
              type="file" 
              id="file" 
              style={{display:"none"}} 
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Adicionar Imagem</span>
              </div>
            </label>
            <div className="item">
              <img src={Map} alt="" />
              <span>Adicionar Local</span>
            </div>
            <div className="item">
              <img src={Friend} alt="" />
              <span>Marcar Amigos</span>
            </div>
          </div>
          <div className="right">
            <button onClick={handleClick}>Compartilhar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
