import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import styles from "./AdminDashboard.module.css";

function AdminDashboard() {

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  const [editingStudent, setEditingStudent] = useState(null);
  const [adding, setAdding] = useState(false);

  // ✏️ EDIT FORM
  const [form, setForm] = useState({
    name: "",
    email: "",
    course: "",
    password: "",
    photo: ""
  });

  // ➕ ADD FORM
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    course: "",
    password: ""
  });

  const [file, setFile] = useState(null);

  const navigate = useNavigate();

  // 🔐 Protect route
  useEffect(() => {
    const isAdmin = localStorage.getItem("admin");

    if (!isAdmin) {
      navigate("/admin");
    } else {
      fetchStudents();
    }
  }, []);

  // 🔄 Fetch students
  const fetchStudents = async () => {
    try {
      const res = await API.get("/students");
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔍 Filter
  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  // ❌ DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;

    try {
      await API.delete(`/students/${id}`);
      fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  // ✏️ EDIT
  const handleEdit = (student) => {
    setEditingStudent(student);
    setAdding(false);

    setForm({
      name: student.name,
      email: student.email,
      course: student.course,
      password: "",
      photo: student.photo || ""
    });
  };

  // ➕ ADD BUTTON
  const handleAddClick = () => {
    setAdding(true);
    setEditingStudent(null);

    setNewStudent({
      name: "",
      email: "",
      course: "",
      password: ""
    });
  };

  // 🧠 INPUT CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNewChange = (e) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
  };

  // 📁 FILE
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // 🔄 UPDATE
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

      await API.put(`/students/${editingStudent.id}`, {
        ...form,
        photo: photoName
      });

      setEditingStudent(null);
      setFile(null);
      fetchStudents();

    } catch (err) {
      console.error(err);
    }
  };

  // ➕ CREATE
  const handleAddStudent = async (e) => {
    e.preventDefault();

    try {
      await API.post("/students/register", newStudent);

      setAdding(false);
      fetchStudents();

    } catch (err) {
      console.error(err);
      alert("Failed to add student");
    }
  };

  // 🔓 LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/admin");
  };

  return (
    <div className={styles.adminPage}>

      {/* HEADER */}
      <div className={styles.adminHeader}>
        <h2>Admin Dashboard</h2>

        <div>
          <button onClick={handleAddClick}>+ Add Student</button>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <div className={styles.searchSection}>
        <input
          type="text"
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* ➕ ADD FORM */}
      {adding && (
        <div className={styles.editCard}>
          <h3>Add Student</h3>

          <form onSubmit={handleAddStudent} className={styles.editForm}>

            <div className={styles.editGroup}>
              <label>Name</label>
              <input name="name" onChange={handleNewChange} required />
            </div>

            <div className={styles.editGroup}>
              <label>Email</label>
              <input name="email" onChange={handleNewChange} required />
            </div>

            <div className={styles.editGroup}>
              <label>Course</label>
              <input name="course" onChange={handleNewChange} required />
            </div>

            <div className={styles.editGroup}>
              <label>Password</label>
              <input type="password" name="password" onChange={handleNewChange} required />
            </div>

            <div className={styles.formActions}>
              <button type="submit">Create</button>
              <button type="button" onClick={() => setAdding(false)}>
                Cancel
              </button>
            </div>

          </form>
        </div>
      )}

      {/* ✏️ EDIT FORM */}
      {editingStudent && (
        <div className={styles.editCard}>
          <h3>Edit Student</h3>

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
              <label>Upload Photo</label>
              <input type="file" onChange={handleFileChange} />
            </div>

            <div className={styles.formActions}>
              <button type="submit">Update</button>
              <button type="button" onClick={() => setEditingStudent(null)}>
                Cancel
              </button>
            </div>

          </form>
        </div>
      )}

      {/* LIST */}
      <div className={styles.studentList}>
        {filteredStudents.length === 0 ? (
          <p className={styles.emptyText}>No students found</p>
        ) : (
          filteredStudents.map((s) => (
            <div key={s.id} className={styles.studentCard}>

              {s.photo && (
                <img
                  src={`http://localhost:8080/uploads/${s.photo}`}
                  alt="student"
                  className={styles.studentImage}
                />
              )}

              <div className={styles.studentInfo}>
                <h4>{s.name}</h4>
                <p>{s.email}</p>
                <p>{s.course}</p>
              </div>

              <div className={styles.cardActions}>
                <button onClick={() => handleEdit(s)}>Edit</button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className={styles.deleteBtn}
                >
                  Delete
                </button>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;