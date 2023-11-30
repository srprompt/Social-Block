import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.scss";
import axios from "axios";

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    senha: "",
    nome: "",
  });
  const [err, setErr] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

     // Validar se todos os campos obrigatórios estão preenchidos
     if (!inputs.username || !inputs.email || !inputs.senha || !inputs.nome) {
      setErr("Por favor, preencha todos os campos.");
      return;
    }

    try {
      await axios.post("https://socialblock-api-ybhf2.ondigitalocean.app/api/autenticacao/register", inputs);
      setIsRegistered(true);
    } catch (err) {
      setErr(err.response.data);
    }
  };

  useEffect(() => {
    if (isRegistered) {
      // Aguarde um pouco para que o estado do pop-up seja exibido antes de redirecionar
      setTimeout(() => {
        setIsRegistered(false);
        navigate("/login");
      }, 1500);
    }
  }, [isRegistered, navigate]);

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <span>Já tem uma conta?</span>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Registrar</h1>
          <form>
            <input
              type="text"
              placeholder="Usuário"
              name="username"
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Senha"
              name="senha"
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Nome"
              name="nome"
              onChange={handleChange}
            />
            {err && <p className="error-message">{err}</p>}
            <button onClick={handleClick}>Registrar</button>
            {isRegistered && <div className="popup">Registro realizado com sucesso!</div>}
          </form>
        </div>
      </div>
      
    </div>
  );
};

export default Register;
