import React, { useState } from "react";
import maskot1 from "../../assets/images/maskot1.png"; 
import maskot2 from "../../assets/images/maskot2.png"; 
import { authService } from "../../api/authService";
import { toast } from "sonner";

const LoginRegister = ({ onLoginSuccess, onRegisterSuccess }) => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Pembeli");
  const [alamat, setAlamat] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (onLoginSuccess) {
      await onLoginSuccess({ email, password });
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Password dan Confirm Password tidak cocok.");
      return;
    }

    const signUpData = {
      username,
      email,
      password,
      role,
      ...(role === "Organisasi Amal" && { alamat }),
    };

    try {
      const response = await authService.register(signUpData);
      setIsRightPanelActive(false);

      if(response) { 
        onRegisterSuccess({ email, password });
        toast.success('Registrasi berhasil!');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
        console.error(err.response.data.message);
      } else {
        setError("Registrasi gagal. Silakan coba lagi.");
      }
      toast.error("Registrasi gagal!");
      console.error(err);
    }
  };

  return (
    <div className="login-register-component">
      <div className="container py-5">
        <div className={`auth-container ${isRightPanelActive ? "right-panel-active" : ""}`}>
          {/* Sign Up Form */}
          <div className="auth-form sign-up">
            <form onSubmit={handleSignUp}>
              <h1 className="mb-4">Register</h1>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              {role === "Organisasi Amal" && (
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    name="alamat"
                    placeholder="Alamat"
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                    required
                  />
                </div>
              )}
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3 role-selection">
                <label className="me-3">
                  <input
                    type="radio"
                    name="role"
                    value="Pembeli"
                    checked={role === "Pembeli"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  Pembeli
                </label>
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="Organisasi Amal"
                    checked={role === "Organisasi Amal"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  Organisasi Amal
                </label>
              </div>
              {error && <p className="error-message">{error}</p>}
              <button className="btn custom-btn" type="submit">Daftar</button>
            </form>
          </div>

          {/* Log In Form */}
          <div className="auth-form log-in">
            <form onSubmit={handleLogin}>
              <h1 className="mb-4">Login</h1>
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <button className="btn forgot-password" data-bs-toggle="modal" data-bs-target="#forgot-password-modal" type="button">Forgot your password?</button>
              </div>
              <button className="btn custom-btn" type="submit">Masuk</button>
            </form>
          </div>

          {/* Overlay */}
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h4>Sudah Punya Akun? Yuk Masuk!</h4>
                <img className="maskot" src={maskot2} alt="Login maskot" />
                <button className="btn ghost" onClick={() => setIsRightPanelActive(false)}>Masuk</button>
              </div>
              <div className="overlay-panel overlay-right">
                <h4>Belom Punya Akun? Yuk Daftar!</h4>
                <img className="maskot" src={maskot1} alt="Regis maskot" />
                <button className="btn ghost" onClick={() => setIsRightPanelActive(true)}>Daftar</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-register-component {
          background-color: #FFFFFF;
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
        }

        .auth-container {
          position: relative;
          width: 100%;
          max-width: 850px;
          min-height: 550px;
          background: #FFFFFF;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
          margin: 0 auto;
        }

        .auth-form {
          position: absolute;
          top: 0;
          height: 100%;
          width: 50%;
          transition: all 0.6s ease-in-out;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 0 50px;
          text-align: center;
        }

        .sign-up {
          left: 0;
          opacity: 0;
          z-index: 1;
        }

        .log-in {
          left: 0;
          z-index: 2;
        }

        .right-panel-active .sign-up {
          transform: translateX(100%);
          opacity: 1;
          z-index: 5;
        }

        .right-panel-active .log-in {
          transform: translateX(100%);
          opacity: 0;
          z-index: 1;
        }

        h1 {
          color: #03081F;
          font-weight: bold;
          font-size: 24px;
          letter-spacing: 0.5px;
          margin-bottom: 25px;
        }

        .form-control {
          width: 100%;
          max-width: 300px;
          background: #FFFFFF;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #D3D3D3;
          color: #03081F;
          font-size: 14px;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .form-control:focus {
          border-color: #028643;
          box-shadow: 0 0 0 2px rgba(2, 134, 67, 0.2);
          outline: none;
        }

        .form-control::placeholder {
          color: #6C757D;
          opacity: 0.7;
        }

        .forgot-password {
          color: #FC8A06;
          font-size: 14px;
          text-decoration: none;
          align-self: flex-start;
          transition: color 0.3s ease;
        }

        .forgot-password:hover {
          color: #03081F;
          text-decoration: underline;
        }

        .custom-btn {
          color: #FFFFFF;
          background: #028643;
          font-size: 14px;
          font-weight: bold;
          padding: 12px 50px;
          border-radius: 20px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .custom-btn:hover {
          background: #016d38;
          transform: translateY(-2px);
          box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
        }

        .custom-btn:active {
          transform: translateY(0);
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .overlay-container {
          position: absolute;
          top: 0;
          left: 50%;
          width: 50%;
          height: 100%;
          overflow: hidden;
          z-index: 100;
          transition: transform 0.6s ease-in-out;
        }

        .right-panel-active .overlay-container {
          transform: translateX(-100%);
        }

        .overlay {
          position: relative;
          background: linear-gradient(135deg, #028643 0%, #39754B 100%);
          left: -100%;
          height: 100%;
          width: 200%;
          transition: transform 0.6s ease-in-out;
          z-index: 2;
        }

        .right-panel-active .overlay {
          transform: translateX(50%);
        }

        .overlay-panel {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 0 40px;
          text-align: center;
          top: 0;
          height: 100%;
          width: 50%;
          z-index: 2;
        }

        .maskot {
          width: 100%;
          max-width: 250px;
          height: auto;
          object-fit: contain;
          margin: 20px 0;
        }

        .overlay-panel h4 {
          color: #FFFFFF;
          font-weight: bold;
          font-size: 18px;
          letter-spacing: 0.5px;
        }

        .overlay-left {
          transform: translateX(0);
        }

        .overlay-right {
          right: 0;
          transform: translateX(0);
        }

        .right-panel-active .overlay-left {
          transform: translateX(0);
        }

        .right-panel-active .overlay-right {
          transform: translateX(200%);
        }

        .ghost {
          background: transparent;
          border: 2px solid #FFFFFF;
          color: #FFFFFF;
          padding: 12px 40px;
          border-radius: 20px;
          font-weight: bold;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          transition: all 0.3s ease;
        }

        .ghost:hover {
          background: rgba(255, 255, 255, 0.2);
          color: #FFFFFF;
        }

        .role-selection {
          display: flex;
          justify-content: center;
          gap: 20px;
        }

        .role-selection label {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: #03081F;
          cursor: pointer;
        }

        .role-selection input[type="radio"] {
          margin-right: 5px;
          accent-color: #028643;
        }

        .error-message {
          color: #DC3545;
          font-size: 14px;
          text-align: center;
          margin-bottom: 10px;
        }

        @media (max-width: 768px) {
          .auth-container {
            min-height: 500px;
            max-width: 90%;
          }

          .auth-form {
            padding: 0 30px;
          }

          .maskot {
            max-width: 200px;
            height: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginRegister;