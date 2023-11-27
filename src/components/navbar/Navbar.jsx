import React, { useState } from 'react';
import "./navbar.scss";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import logo from "../../assets/social-block-logo.png";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import { useNavigate } from 'react-router-dom'; // Importe useNavigate

const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);
  const [ showDropdown, setShowDropdown] = useState(false); // Estado para mostrar/esconder o dropdown.
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate(); // Uso de useNavigate ao invés de useHistory

  const handleLogout = () => {
    logout().then(() => {
      navigate.push('/login');  // Redireciona para a página de login após logout
    }).catch((error) => {
      console.error('Logout failed', error);
    });
  };

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <h2>Social Block</h2>
        </Link>
        {darkMode ? (
          <WbSunnyOutlinedIcon onClick={toggle} />
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} />
        )}
        <div className="search">
          <SearchOutlinedIcon />
          <input type="text" placeholder="Pesquisar..." />
        </div>
      </div>
      <div className="right">
        <div className="user" onClick={() => setShowDropdown(!showDropdown)}>
          <img
                src={currentUser.fotoPerfil ? `/upload/${currentUser.fotoPerfil}` : 'https://cdn.discordapp.com/attachments/897543119078322176/1178345420011876412/registro-sb.jpg?ex=6575ceb0&is=656359b0&hm=fb5741d4a6575d03345320714bd5ac772d8ff4b59dc28a2b1e0262f75be8157a&'}
                alt=""
                className="userImage"
              />
          <span>{currentUser.nome}</span>
          {showDropdown && (
            <div className="dropdown">
              <ul>
                <li>
                  <Link to={`/profile/${currentUser.id}`} onClick={() => setShowDropdown(false)}>
                    Entrar no perfil
                  </Link>
                </li>
                <li onClick={handleLogout}>
                  Deslogar
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
