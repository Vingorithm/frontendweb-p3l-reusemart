import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { authService } from "../api/authService";
import { decodeToken } from "../utils/jwtUtils";
import LoginRegister from '../components/form/LoginRegister';

const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleLoginSuccess = async ({ email, password }) => {
    try {
      const token = await authService.login({ email, password });

      const storedToken = localStorage.getItem("authToken");
      if (!storedToken) {
        throw new Error("Token tidak ditemukan setelah login.");
      }

      const role = decodeToken(storedToken);
      if (!role) {
        throw new Error("Role tidak ditemukan di token.");
      }

      switch (role.toLowerCase()) {
        case "owner":
          navigate("/owner");
          break;
        case "admin":
          navigate("/admin");
          break;
        case "pegawai gudang":
          navigate("/pegawai-gudang");
          break;
        case "pembeli":
          navigate("/pembeli");
          break;
        case "penitip":
          navigate("/penitip");
          break;
        case "cs":
          navigate("/cs");
          break;
        case "organisasi":
          navigate("/organisasi");
          break;
        default:
          throw new Error("Role tidak valid.");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Login gagal. Silakan periksa kredensial Anda.");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="container py-5">
        <LoginRegister onLoginSuccess={handleLoginSuccess} />
      </div>
      {error && <p className="error-message">{error}</p>}

      <style jsx>{`
        .login-page {
          background-color: #fff;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .error-message {
          color: red;
          font-size: 14px;
          text-align: center;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;