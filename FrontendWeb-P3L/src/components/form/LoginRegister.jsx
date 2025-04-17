import React, { useState } from "react";

const LoginRegister = ({ onLoginSuccess }) => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  
  const handleLogin = (e) => {
    e.preventDefault();
    // You can implement actual login logic here
    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };
  
  return (
    <div className="login-register-component">
      <div className="container py-5">
        <div className={`auth-container ${isRightPanelActive ? "right-panel-active" : ""}`}>
          {/* Sign Up Form */}
          <div className="auth-form sign-up">
            <form>
              <h1 className="mb-4">Sign Up</h1>
              <div className="mb-3">
                <input type="text" className="form-control" name="username" placeholder="Username" required />
              </div>
              <div className="mb-3">
                <input type="email" className="form-control" name="email" placeholder="Email" required />
              </div>
              <div className="mb-3">
                <input type="password" className="form-control" name="password" placeholder="Password" required />
              </div>
              <div className="mb-4">
                <input type="password" className="form-control" name="confirmPassword" placeholder="Confirm Password" required />
              </div>
              <button className="btn custom-btn" type="submit">Sign Up</button>
            </form>
          </div>

          {/* Log In Form */}
          <div className="auth-form log-in">
            <form onSubmit={handleLogin}>
              <h1 className="mb-4">Log In</h1>
              <div className="mb-3">
                <input type="email" className="form-control" name="email" placeholder="Email" required />
              </div>
              <div className="mb-3">
                <input type="password" className="form-control" name="password" placeholder="Password" required />
              </div>
              <div className="mb-4">
                <a href="#" className="forgot-password">Forgot your password?</a>
              </div>
              <button className="btn custom-btn" type="submit">Log In</button>
            </form>
          </div>

          {/* Overlay */}
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h1>Already Have an Account?</h1>
                <p>Log in with your details to continue your journey with us</p>
                <button className="btn ghost" onClick={() => setIsRightPanelActive(false)}>Log in</button>
              </div>
              <div className="overlay-panel overlay-right">
                <h1>Don't Have an Account?</h1>
                <p>Enter your personal details and start your journey with us</p>
                <button className="btn ghost" onClick={() => setIsRightPanelActive(true)}>Sign Up</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-register-component {
          background-color: #FCFBF0;
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          background-image: linear-gradient(135deg, rgba(147, 165, 136, 0.2) 0%, rgba(252, 251, 240, 0.8) 100%);
        }

        .auth-container {
          position: relative;
          width: 100%;
          max-width: 850px;
          min-height: 550px;
          background: #FCFBF0;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 14px 28px rgba(57, 117, 75, 0.18),
                      0 10px 10px rgba(57, 117, 75, 0.12);
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
          color: #39754B;
          font-weight: 700;
          font-size: 32px;
          letter-spacing: 1px;
          position: relative;
        }

        h1:after {
          content: '';
          position: absolute;
          left: 50%;
          bottom: -10px;
          transform: translateX(-50%);
          height: 3px;
          width: 50px;
          background: #39754B;
          border-radius: 2px;
        }

        .form-control {
          background: #FCFBF0;
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #93A588;
          color: #1A1816;
          font-size: 14px;
          transition: border-color 0.3s ease;
        }

        .form-control:focus {
          border-color: #39754B;
          box-shadow: 0 0 0 2px rgba(57, 117, 75, 0.2);
        }

        .form-control::placeholder {
          color: #93A588;
          opacity: 0.7;
        }

        .forgot-password {
          color: #39754B;
          font-size: 14px;
          text-decoration: none;
          align-self: flex-start;
          transition: color 0.3s ease;
        }

        .forgot-password:hover {
          color: #1A1816;
          text-decoration: underline;
        }

        .custom-btn {
          color: #FCFBF0;
          background: #39754B;
          font-size: 14px;
          font-weight: 600;
          padding: 14px 60px;
          border-radius: 30px;
          letter-spacing: 1px;
          text-transform: uppercase;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(57, 117, 75, 0.2);
        }

        .custom-btn:hover {
          background: #2a5437;
          transform: translateY(-2px);
          box-shadow: 0 6px 10px rgba(57, 117, 75, 0.3);
        }

        .custom-btn:active {
          transform: translateY(0) scale(0.98);
          box-shadow: 0 2px 5px rgba(57, 117, 75, 0.2);
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
          background: linear-gradient(135deg, #39754B 0%, #93A588 100%);
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

        .overlay-panel h1, .overlay-panel p {
          color: #FCFBF0;
        }

        .overlay-panel p {
          font-size: 16px;
          font-weight: 400;
          line-height: 1.5;
          letter-spacing: 0.5px;
          margin: 20px 0;
          max-width: 80%;
          text-align: center;
        }

        .overlay-left {
          transform: translateX(0);
          background: linear-gradient(rgba(57, 117, 75, 0.8), rgba(26, 24, 22, 0.7)), url('https://via.placeholder.com/800x600');
          background-size: cover;
          background-position: center;
        }

        .overlay-right {
          right: 0;
          transform: translateX(0);
          background: linear-gradient(rgba(57, 117, 75, 0.8), rgba(26, 24, 22, 0.7)), url('https://via.placeholder.com/800x600');
          background-size: cover;
          background-position: center;
        }

        .right-panel-active .overlay-left {
          transform: translateX(0);
        }

        .right-panel-active .overlay-right {
          transform: translateX(200%);
        }

        .ghost {
          background: transparent;
          border: 2px solid #FCFBF0;
          color: #FCFBF0;
          padding: 14px 45px;
          border-radius: 30px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          transition: all 0.3s ease;
        }

        .ghost:hover {
          background: rgba(252, 251, 240, 0.2);
          color: #FCFBF0;
        }

        @media (max-width: 768px) {
          .auth-container {
            min-height: 500px;
            max-width: 90%;
          }

          .auth-form {
            padding: 0 30px;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginRegister;