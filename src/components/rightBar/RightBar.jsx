import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/authContext';
import './rightBar.scss';
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";

const RightBar = () => {
  const [users, setUsers] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { pathname } = useLocation();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (usuarioId, following) => {
      if (following) {
        return makeRequest.delete(`/relacionamento?usuarioId=${usuarioId}`);
      }
      return makeRequest.post("/relacionamento", { usuarioId });
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(["relacionamento"]);
    },
  });

  const handleFollow = (usuarioId, following) => {
    mutation.mutate(usuarioId, following);
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://socialblock-api-ybhf2.ondigitalocean.app/api/getAllUsers');
      // Filtra o usuário atual da lista
      const filteredUsers = response.data.filter(user => user.id !== currentUser.id);
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Erro ao buscar usuários', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`rightBar ${collapsed ? "collapsed" : ""}`}>
      <div className="container">
        <div className="item">
          <span>Sugestões de Usuários</span>
          {users.map((user) => (
            <div className="user" key={user.id}>
              <div className="userInfo">
                <Link to={`/profile/${user.id}`}>
                  <img
                    src={user.fotoPerfil ? `/upload/${user.fotoPerfil}` : 'https://cdn.discordapp.com/attachments/897543119078322176/1178345420011876412/registro-sb.jpg?ex=6575ceb0&is=656359b0&hm=fb5741d4a6575d03345320714bd5ac772d8ff4b59dc28a2b1e0262f75be8157a&'}
                    alt={`${user.nome}'s Profile`}
                    className="userImage"
                  />
                </Link>
                <div className="userDetails">
                  <span className="userName">{user.nome}</span>
                  <span className="userUsername">{`@${user.username}`}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Outras seções... */}
      </div>
    </div>
  );
};

export default RightBar;
