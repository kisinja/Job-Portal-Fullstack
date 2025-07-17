import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import FlashMessage from "../components/FlashMessage";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [flashMessage, setFlashMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, error, loading } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
    setFlashMessage(error);
  };

  const clearMessage = () => {
    setFlashMessage("");
  };

  return (
    <div className="login-container">
      <div className="login-left-panel">
        <div className="login-branding">
          <h1>TechPoster</h1>
          <h2>Connecting Tech Talent with Opportunities</h2>
          <div className="login-features">
            <div className="feature-item">
              <span className="feature-icon">💼</span>
              <span>Find your dream tech job</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">👥</span>
              <span>Connect with top recruiters</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🚀</span>
              <span>Accelerate your career</span>
            </div>
          </div>
        </div>
      </div>

      <div className="login-right-panel">
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-header">
            <h1>Welcome Back</h1>
            <p>Sign in to access your TechPoster account</p>
          </div>

          <FlashMessage message={flashMessage} clearMessage={clearMessage} />

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              autoComplete="off"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="off"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
              />
              {showPassword ? (
                <FaRegEyeSlash
                  className="absolute right-2 top-4 cursor-pointer text-gray-400 text-lg"
                  title="Hide password"
                  onClick={() => setShowPassword(!showPassword)}
                />
              ) : (
                <FaRegEye
                  className="absolute right-2 top-4 cursor-pointer text-gray-400 text-lg"
                  title="Show password"
                  onClick={() => setShowPassword(!showPassword)}
                />
              )}
            </div>
          </div>

          <div className="form-options">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="/forgot-password" className="forgot-password">
              Forgot password?
            </a>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? <span className="button-loader"></span> : "Sign In"}
          </button>

          <div className="form-footer">
            Don&apos;t have an account? <a href="/signup">Sign up</a>
          </div>

          <div className="social-login">
            <div className="divider">Or continue with</div>
            <div className="social-buttons">
              <button type="button" className="social-button google">
                <span className="social-icon">G</span> Google
              </button>
              <button type="button" className="social-button linkedin">
                <span className="social-icon">in</span> LinkedIn
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
