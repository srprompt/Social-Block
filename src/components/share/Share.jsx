import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import TheatersOutlinedIcon from '@mui/icons-material/TheatersOutlined';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';

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

    let mediaUrl = "";
    if (file) {
      mediaUrl = await upload(); // Upload do arquivo (imagem ou vídeo)
    }

    // Verifica o tipo do arquivo para distinguir vídeos de imagens
    const isVideo = file && file.type.startsWith('video/');
    
    // Cria um objeto de post com campos condicionais para img e vídeo
    const postObj = {
      descricao,
      ...(isVideo ? { video: mediaUrl } : { img: mediaUrl })
    };

    mutation.mutate(postObj);

    // Limpa o estado depois do upload
    setDesc("");
    setFile(null);
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
          <img
            src={currentUser.fotoPerfil ? `/upload/${currentUser.fotoPerfil}` : 'https://cdn.discordapp.com/attachments/897543119078322176/1178345420011876412/registro-sb.jpg?ex=6575ceb0&is=656359b0&hm=fb5741d4a6575d03345320714bd5ac772d8ff4b59dc28a2b1e0262f75be8157a&'}
            alt=""
            className="currentUserImage"
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
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="file">
              <div className="item">
                <AddPhotoAlternateOutlinedIcon />
                <span>Adicionar Imagem</span>
              </div>
            </label>
            
            <input 
              type="file" 
              id="video" 
              style={{display:"none"}}
              accept="video/*" 
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="video">
              <div className="item">
                <TheatersOutlinedIcon />
                <span>Adicionar Vídeo</span>
              </div>
            </label>
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
