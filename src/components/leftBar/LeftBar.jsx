import "./leftBar.scss";
import Friends from "../../assets/1.png";
import Groups from "../../assets/2.png";
import Market from "../../assets/3.png";
import Watch from "../../assets/4.png";
import Memories from "../../assets/5.png";
import Events from "../../assets/6.png";
import Gaming from "../../assets/7.png";
import Gallery from "../../assets/8.png";
import Videos from "../../assets/9.png";
import Messages from "../../assets/10.png";
import Tutorials from "../../assets/11.png";
import Courses from "../../assets/12.png";
import Fund from "../../assets/13.png";
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
import { Link } from "react-router-dom";

const LeftBar = () => {

  const { currentUser } = useContext(AuthContext);

  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
          <div className="user">
            <Link to={`/profile/${currentUser.id}`} className="user" style={{ textDecoration: 'none', color: 'inherit' }}>
              <img
                src={currentUser.fotoPerfil ? `/upload/${currentUser.fotoPerfil}` : 'https://cdn.discordapp.com/attachments/897543119078322176/1178345420011876412/registro-sb.jpg?ex=6575ceb0&is=656359b0&hm=fb5741d4a6575d03345320714bd5ac772d8ff4b59dc28a2b1e0262f75be8157a&'}
                alt=""
                className="userImage"
              />
              <span>{currentUser.nome}</span>
            </Link>
          </div>
          <div className="item">
            <PeopleOutlinedIcon />
            <span>Amigos</span>
          </div>
          <div className="item">
            <QuestionAnswerOutlinedIcon />
            <span>Grupos</span>
          </div>
        </div>
        <hr />
        </div>
    </div>
  );
};

export default LeftBar;
