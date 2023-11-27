import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import "./login.scss";

const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const [err, setErr] = useState(null);

  const navigate = useNavigate()

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const { login } = useContext(AuthContext);
  

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validar se ambos os campos de usuário e senha estão preenchidos
    if (!inputs.username && !inputs.password) {
      setErr("Por favor, preencha o usuário e a senha.");
      return;
    }

    try {
      await login(inputs);
      navigate("/");
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setErr("Usuário não encontrado. Por favor, verifique suas credenciais.");
      } else {
        setErr("Ocorreu um erro durante o login. Tente novamente mais tarde.");
      }
    }
  };

   

  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <span>Ainda não está presente?</span>
          <Link to="/register">
            <button>Faça parte</button>
          </Link>
        </div>
        <div className="right">
          <h1>Login</h1>
          <form>
            <input
              type="text"
              placeholder="Usuário"
              name="username"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Senha"
              name="senha"
              onChange={handleChange}
            />
            {err && err}
            <button onClick={handleLogin}>Entrar</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
