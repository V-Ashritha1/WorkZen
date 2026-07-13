import { useState } from "react";
import { loginApi, saveLoggedUser } from "../service/AuthApiService";
import { useNavigate, Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import "../css/tasks.css";

const LoginComponent = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({ username: "", password: "" });

  function handleLoginForm(event) {
    event.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    loginApi(username, password)
      .then((response) => {
        const { id, role, token } = response.data;
        saveLoggedUser(id, username, role, token);
        navigate(`/tasks`);
      })
      .catch((error) => {
        console.error(error);
        if (error.response?.status === 401) {
          toast.error("Invalid username or password");
        } else {
          toast.error("Couldn't log in right now. Please try again.");
        }
      })
      .finally(() => setSubmitting(false));
  }

  function validateForm() {
    const errorsCopy = { username: "", password: "" };
    let valid = true;

    if (!username.trim()) {
      errorsCopy.username = "Username required";
      valid = false;
    }
    if (!password.trim()) {
      errorsCopy.password = "Password required";
      valid = false;
    }
    setErrors(errorsCopy);
    return valid;
  }

  return (
    <div className="auth-page fade-in">
      <div className="auth-card">
        <h2>Welcome back</h2>
        <p className="auth-subtitle">Log in to your WorkZen workspace</p>
        <form onSubmit={handleLoginForm}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className={`form-control ${errors.username ? "is-invalid" : ""}`}
              placeholder="Username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
            {errors.username && <div className="invalid-feedback">{errors.username}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? <Spinner animation="border" size="sm" /> : "Log in"}
          </button>
        </form>
        <div className="auth-switch">
          Don&apos;t have an account? <Link to="/create-account">Create one</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
