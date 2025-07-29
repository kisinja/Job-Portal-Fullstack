import { useState } from "react";
import { useSignUp } from "../hooks/useSignUp";
import { useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("job-seeker");

  const [showPassword, setShowPassword] = useState(false);

  const { error, loading, signUp } = useSignUp();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signUp(username, email, password, role);
    navigate("/login");
    setUsername("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="signup-container">
      <div className="signup-left-panel">
        <div className="signup-branding">
          <h1>TechPoster</h1>
          <h2>Your Gateway to Tech Opportunities</h2>
          <div className="signup-features">
            <div className="feature-item">
              <span className="feature-icon">🔍</span>
              <span>Discover your perfect tech role</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📈</span>
              <span>Grow your professional network</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💡</span>
              <span>Showcase your skills to employers</span>
            </div>
          </div>
        </div>
      </div>

      <div className="signup-right-panel">
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-header">
            <h1>Create Your Account</h1>
            <p>Join TechPoster to access thousands of tech opportunities</p>
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              autoComplete="off"
              name="username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
            />
          </div>

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
            <label htmlFor="role">Role</label>
            <select
              name="role"
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border border-gray-200 focus:border-blue-500 focus:ring-blue-500 p-2 w-full rounded-md text-gray-400"
            >
              <option value="job-seeker">Job Seeker</option>
              <option value="employer">Employer</option>
            </select>
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

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? (
              <span className="button-loader"></span>
            ) : (
              "Create Account"
            )}
          </button>

          <div className="form-footer">
            Already have an account? <a href="/login">Log in</a>
          </div>

          <div className="social-signup">
            <div className="divider">Or sign up with</div>
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

export default SignUp;
