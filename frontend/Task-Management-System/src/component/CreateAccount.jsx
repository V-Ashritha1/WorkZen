import { useState } from "react";
import { registerApi } from "../service/AuthApiService";
import { useNavigate, Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import "../css/tasks.css";

const CreateAccount = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({ username: "", email: "", password: "" });

  function handleRegistrationForm(event) {
    event.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    registerApi({ username, email, password })
      .then(() => {
        toast.success("Account created — please log in");
        navigate("/login");
      })
      .catch((error) => {
        console.error(error);
        const message = error.response?.data?.message;
        toast.error(message || "Couldn't create your account. Please try again.");
      })
      .finally(() => setSubmitting(false));
  }

  function validateForm() {
    const errorsCopy = { username: "", email: "", password: "" };
    let valid = true;

    if (!username.trim()) {
      errorsCopy.username = "Username required";
      valid = false;
    }

    if (!email.trim()) {
      errorsCopy.email = "Email required";
      valid = false;
    } else if (!isValidEmail(email)) {
      errorsCopy.email = "Invalid email address";
      valid = false;
    }

    if (!password.trim()) {
      errorsCopy.password = "Password required";
      valid = false;
    } else if (password.length < 6) {
      errorsCopy.password = "Password must be at least 6 characters long";
      valid = false;
    }

    setErrors(errorsCopy);
    return valid;
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  return (
    <div className="auth-page fade-in">
      <div className="auth-card">
        <h2>Create account</h2>
        <p className="auth-subtitle">Join WorkZen and start organizing your work</p>
        <form onSubmit={handleRegistrationForm}>
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
            <label className="form-label">Email</label>
            <input
              type="text"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
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
            {submitting ? <Spinner animation="border" size="sm" /> : "Create account"}
          </button>
        </form>
        <div className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
