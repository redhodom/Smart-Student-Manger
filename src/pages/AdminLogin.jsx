import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import styles from "./AdminLogin.module.css";

function AdminLogin() {

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
      const res = await API.post("/students/admin/login", form);

      if (res.data === "Admin login successful") {
        localStorage.setItem("admin", "true");
        navigate("/admin/dashboard");
      } else {
        setError(res.data);
      }

    } catch (err) {
      setError("Admin login failed");
    }
  };

  return (
    <div className={styles.adminPage}>
      <div className={styles.adminCard}>

        {/* HEADER */}
        <div className={styles.adminHeader}>
          <h2>Admin Panel</h2>
          <p>Authorized access only</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className={styles.adminForm}>

          <div className={styles.adminGroup}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter admin email"
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.adminGroup}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className={styles.errorText}>{error}</p>}

          <button type="submit" className={styles.adminBtn}>
            Login
          </button>
        </form>

        {/* FOOTER */}
        <div className={styles.adminFooter}>
          <p>
            Back to student login?
            <span onClick={() => navigate("/")}>
              Go here
            </span>
          </p>
        </div>

      </div>
    </div>
  );
}

export default AdminLogin;