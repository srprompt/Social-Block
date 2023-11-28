import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import "./login.scss";
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous"/>

const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const [err, setErr] = useState(null);

  const navigate = useNavigate();

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
    
    <div className="container-fluid login">
      
      <div className="row card">
        <div className="col-md-6 left">
          <span>Ainda não está presente?</span>
          <Link to="/register">
            <button className="btn btn-light">Faça parte</button>
          </Link>
        </div>
        <div className="col-md-6 right">
          <h1>Login</h1>
          <form>
            <div className="form-group">
              <input
                type="text"
                placeholder="Usuário"
                name="username"
                className="form-control"
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Senha"
                name="senha" 
                className="form-control"
                onChange={handleChange}
              />
            </div>
            {err && <p className="text-danger">{err}</p>}
            <button onClick={handleLogin} className="btn btn-dark">Entrar</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
