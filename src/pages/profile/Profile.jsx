import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";
import { useState } from "react";

const Profile = () => {

  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const usuarioId = parseInt(useLocation().pathname.split("/")[2]);

  const { isPending, error, data } = useQuery({queryKey: ['user'], queryFn: () =>
    makeRequest.get("/usuario/find/" + usuarioId).then((res) => {
      return res.data;
    })
  });

  const { isPending: rIsPending, data: relationshipData } = useQuery({queryKey: ['relationship'], queryFn: () =>
    makeRequest.get("/relacionamento?followedUsuarioId=" + usuarioId).then((res) => {
      return res.data;
    })
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (following)=>{
      if (following)
        return makeRequest.delete("/relacionamento?usuarioId=" + usuarioId);
      return makeRequest.post("/relacionamento", { usuarioId });
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(["relacionamento"]);
    },
  });

  const handleFollow = () => {
    mutation.mutate(relationshipData.includes(currentUser.id));
  };

  return (
    <div className="profile">
      {isPending ? "Carregando..." : <>
      <div className="images">
        <img
          src={"/upload/" + data.fotoCapa}
          alt=""
          className="cover"
        />
        <img
          src={"/upload/" + data.fotoPerfil}
          alt=""
          className="profilePic"
        />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            <a href="http://facebook.com">
              <FacebookTwoToneIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <InstagramIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <TwitterIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <LinkedInIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <PinterestIcon fontSize="large" />
            </a>
          </div>
          <div className="center">
            <span>{data.nome}</span>
            <div className="info">
              <div className="item">
                <PlaceIcon />
                <span>{data.cidade}</span>
              </div>
              <div className="item">
                <LanguageIcon />
                <span>{data.website}</span>
              </div>
            </div>
            {rIsPending ? (
              "Carregando..."
              ) : usuarioId === currentUser.id ? (
              <button onClick={()=>setOpenUpdate(true)}>Atualizar</button>
            ) : (
              <button onClick={handleFollow}>
                {relationshipData.includes(currentUser.id)
                ? "Seguindo"
                : "Seguir"}
              </button>
            )}
          </div>
          <div className="right">
            <EmailOutlinedIcon />
            <MoreVertIcon />
          </div>
          
        </div>
      <Posts usuarioId = {usuarioId}/>
      </div>
      </>
      }
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
    </div>
  );
};

export default Profile;
