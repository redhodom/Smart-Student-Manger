import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import styles from "./Register.module.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    course: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/students/register", form);
      setSuccess("Registration successful");

      setTimeout(() => {
        navigate("/");
      }, 1200);

    } catch (err) {
      setError("Registration failed");
    }
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.registerCard}>

        {/* HEADER */}
        <div className={styles.registerHeader}>
          <h2>Create Account</h2>
          <p>Join the student system</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className={styles.registerForm}>

          <div className={styles.registerGroup}>
            <label>Full Name</label>
            <input type="text" name="name" placeholder="Enter your name" onChange={handleChange} required />
          </div>

          <div className={styles.registerGroup}>
            <label>Email</label>
            <input type="email" name="email" placeholder="Enter your email" onChange={handleChange} required />
          </div>

          <div className={styles.registerGroup}>
            <label>Course</label>
            <input type="text" name="course" placeholder="Enter your course" onChange={handleChange} required />
          </div>

          <div className={styles.registerGroup}>
            <label>Password</label>
            <input type="password" name="password" placeholder="Create a password" onChange={handleChange} required />
          </div>

          {error && <p className={styles.errorText}>{error}</p>}
          {success && <p className={styles.successText}>{success}</p>}

          <button type="submit" className={styles.registerBtn}>
            Register
          </button>
        </form>

        {/* FOOTER */}
        <div className={styles.registerFooter}>
          <p>
            Already have an account?
            <span onClick={() => navigate("/")}>
              Login
            </span>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Register;