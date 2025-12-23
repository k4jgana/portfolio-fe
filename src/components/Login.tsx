import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import "../styles/login.css";

interface LoginProps {
  onLogin: (email: string | "guest") => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      onLogin(user.email ?? "guest");
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  const handleGuest = () => {
    onLogin("guest"); 
  };

  return (
    <div className="login-container" role="region" aria-label="Login area">
      <div className="login-box" role="dialog" aria-modal="true">
        <h1>Welcome</h1>

        <button
          type="button"
          className="google-btn"
          onClick={handleGoogleLogin}
          aria-label="Sign in with Google"
        >
          Sign in with Google
        </button>

        <button
          type="button"
          className="guest-login"
          onClick={handleGuest}
          aria-label="Continue as guest"
        >
          Continue as Guest
        </button>

        <p className="login-help">
          You can sign in, or continue without an account.
        </p>
      </div>
    </div>
  );
};

export default Login;
