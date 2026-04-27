import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";

function Dashboard() {

  const [student, setStudent] = useState(null);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    course: "",
    password: "",
    photo: ""
  });

  const [file, setFile] = useState(null);

  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  // 🔐 Protect route
  useEffect(() => {
    if (!email) {
      navigate("/");
    } else {
      fetchStudent();
    }
  }, []);

  // 🔄 Fetch
  const fetchStudent = async () => {
    try {
      const res = await API.get(`/students/email/${email}`);
      setStudent(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✏️ Edit
  const handleEdit = () => {
    setEditing(true);
    setForm({
      name: student.name,
      email: student.email,
      course: student.course,
      password: "",
      photo: student.photo || ""
    });
  };

  // 🧠 Change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 📁 File
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // 🔄 Update
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      let photoName = form.photo;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await API.post("/students/upload", formData);
        photoName = res.data;
      }

      await API.put(`/students/${student.id}`, {
        ...form,
        photo: photoName
      });

      setEditing(false);
      setFile(null);
      fetchStudent();

    } catch (err) {
      console.error(err);
    }
  };

  // ❌ Delete
  const handleDelete = async () => {
    if (!window.confirm("Delete your account permanently?")) return;

    try {
      await API.delete(`/students/${student.id}`);
      localStorage.clear();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  // 🔓 Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className={styles.dashboardPage}>

      {/* PAGE HEADER */}
      <div className={styles.dashboardHeader}>
        <h2>Student Dashboard</h2>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Logout
        </button>
      </div>

      {/* PROFILE CARD */}
      {!student ? (
        <p className={styles.emptyText}>Loading...</p>
      ) : (
        <div className={styles.profileCard}>

          {/* CARD HEADER */}
          <div className={styles.cardHeader}>
            {student.photo && (
              <img
                src={`https://smart-student-service-production-5060.up.railway.app/uploads/${student.photo}`}
                alt="student"
                className={styles.profileImage}
              />
            )}

            <div>
              <h3>{student.name}</h3>
              <span className={styles.roleTag}>Student</span>
            </div>
          </div>

          {/* DIVIDER */}
          <div className={styles.divider}></div>

          {/* DETAILS */}
          <div className={styles.detailsSection}>
            <p><span>Name:</span> {student.name}</p>
            <p><span>Email:</span> {student.email}</p>
            <p><span>Course:</span> {student.course}</p>
            <p><span>Student ID:</span> #{student.id}</p>
          </div>

          {/* EXTRA INFO */}
          <div className={styles.extraSection}>
            <p>📅 Joined: 2024</p>
            <p>🎯 Status: Active</p>
          </div>

          {/* FOOTER */}
          <div className={styles.cardFooter}>
            <button onClick={handleEdit}>Edit Profile</button>
            <button onClick={handleDelete} className={styles.deleteBtn}>
              Delete
            </button>
          </div>

        </div>
      )}

      {/* EDIT FORM */}
      {editing && (
        <div className={styles.editSection}>

          <h3>Edit Profile</h3>

          <form onSubmit={handleUpdate} className={styles.editForm}>

            <div className={styles.editGroup}>
              <label>Name</label>
              <input name="name" value={form.name} onChange={handleChange} />
            </div>

            <div className={styles.editGroup}>
              <label>Email</label>
              <input name="email" value={form.email} onChange={handleChange} />
            </div>

            <div className={styles.editGroup}>
              <label>Course</label>
              <input name="course" value={form.course} onChange={handleChange} />
            </div>

            <div className={styles.editGroup}>
              <label>New Password</label>
              <input
                type="password"
                name="password"
                placeholder="Leave blank"
                onChange={handleChange}
              />
            </div>

            <div className={styles.editGroup}>
              <label>Profile Photo</label>
              <input type="file" onChange={handleFileChange} />
            </div>

            <div className={styles.formActions}>
              <button type="submit">Update</button>
              <button type="button" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>

          </form>
        </div>
      )}
    </div>
  );
}

export default Dashboard;