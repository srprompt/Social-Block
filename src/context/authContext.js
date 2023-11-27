import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  // Método para login como você definiu
  const login = async (inputs) => {
    const res = await axios.post(
      "http://localhost:8800/api/autenticacao/login", inputs, {
      withCredentials: true,
    });
    setCurrentUser(res.data);
  };

  // Método para logout
  const logout = async () => {
    await axios.post("http://localhost:8800/api/autenticacao/logout", {}, {
      withCredentials: true, // Se estiver usando cookies
    });
    setCurrentUser(null); // Atualizar estado do usuário atual
    localStorage.removeItem("user"); // Remover do localStorage
    // Redirecionamento é feito no componente que chama logout
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};