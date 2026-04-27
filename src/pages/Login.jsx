import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import styles from "./Login.module.css";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/students/login", form);

      if (res.data === "Login successful") {
        localStorage.setItem("email", form.email);
        navigate("/dashboard");
      } else {
        setError(res.data);
      }

    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div className={styles.loginPage}>

      {/* 🔝 GLOBAL HEADER */}
      <div className={styles.topHeader}>
        <h1>SMART STUDENT MANAGER</h1>
      </div>

      {/* CARD */}
      <div className={styles.loginCard}>

        {/* HEADER */}
        <div className={styles.loginHeader}>
          <h2>Welcome Back</h2>
          <p>Login to your account</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className={styles.loginForm}>

          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className={styles.errorText}>{error}</p>}

          <button type="submit" className={styles.loginBtn}>
            Login
          </button>
        </form>

        {/* CARD FOOTER */}
        <div className={styles.loginFooter}>
          <p>
            Don’t have an account?
            <span onClick={() => navigate("/register")}>
              Register
            </span>
          </p>

          <p>
            Admin?
            <span onClick={() => navigate("/admin")}>
              Login here
            </span>
          </p>
        </div>

      </div>

      {/* 🔻 GLOBAL FOOTER */}
      <div className={styles.bottomFooter}>
        <p>© 2026 Smart Student Manager | Built with precision</p>
      </div>

    </div>
  );
}

export default Login;