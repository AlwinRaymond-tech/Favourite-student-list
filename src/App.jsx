import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Route, Routes } from "react-router-dom";
import { Award, Heart, Home, Mail, Palette, Sparkles, UserRound, Users, X } from "lucide-react";
import { students } from "./students.js";
import { useStudents } from "./StudentContext.jsx";

function StudentCard({ student, onOpenProfile, onAddToast }) {
  const { addFavourite, isFavourite } = useStudents();
  const favourite = isFavourite(student.id);

  function handleAddFavourite() {
    addFavourite(student);
    onAddToast(`${student.name} added to favourites`);
  }

  return (
    <article className="student-card">
      <div>
        <div className="student-topline">
          <span className="avatar">{student.avatar}</span>
          <p className="student-id">{student.id}</p>
        </div>
        <h2>{student.name}</h2>
        <p>Roll Number: {student.rollNumber}</p>
        <p>Course: {student.course}</p>
        <div className="skill-list">
          {student.skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </div>

      <div className="card-actions">
        <button
          className="ghost-button"
          type="button"
          onClick={() => onOpenProfile(student)}
        >
          <UserRound size={18} />
          Profile
        </button>
        <button
          className={favourite ? "secondary-button" : "primary-button"}
          type="button"
          onClick={handleAddFavourite}
          disabled={favourite}
        >
          <Heart size={18} />
          {favourite ? "Added" : "Add to Favourite"}
        </button>
      </div>
    </article>
  );
}

function StudentListPage({ onOpenProfile, onAddToast }) {
  return (
    <main className="page">
      <header className="page-header">
        <p className="eyebrow">Student List</p>
        <h1>Choose your favourite students</h1>
        <p>
          Students are displayed dynamically using map(), and favourites are
          managed globally with useContext.
        </p>
      </header>

      <section className="student-grid">
        {students.map((student) => (
          <StudentCard
            key={student.id}
            student={student}
            onOpenProfile={onOpenProfile}
            onAddToast={onAddToast}
          />
        ))}
      </section>
    </main>
  );
}

function FavouriteStudentsPage({ onOpenProfile, onAddToast }) {
  const { favouriteStudents, removeFavourite } = useStudents();

  function handleRemoveFavourite(student) {
    removeFavourite(student.id);
    onAddToast(`${student.name} removed from favourites`);
  }

  return (
    <main className="page">
      <header className="page-header">
        <p className="eyebrow">Favourite Students</p>
        <h1>Your saved students</h1>
      </header>

      {favouriteStudents.length === 0 ? (
        <section className="empty-state">
          <Heart size={42} />
          <h2>No favourite students added yet</h2>
          <p>Go to the student list and add students to see them here.</p>
          <Link className="primary-link" to="/">
            View Student List
          </Link>
        </section>
      ) : (
        <section className="student-grid">
          {favouriteStudents.map((student) => (
            <article className="student-card" key={student.id}>
              <div>
                <div className="student-topline">
                  <span className="avatar">{student.avatar}</span>
                  <p className="student-id">{student.id}</p>
                </div>
                <h2>{student.name}</h2>
                <p>Roll Number: {student.rollNumber}</p>
                <p>Course: {student.course}</p>
                <div className="skill-list">
                  {student.skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </div>

              <div className="card-actions">
                <button
                  className="ghost-button"
                  type="button"
                  onClick={() => onOpenProfile(student)}
                >
                  <UserRound size={18} />
                  Profile
                </button>
                <button
                  className="danger-button"
                  type="button"
                  onClick={() => handleRemoveFavourite(student)}
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

function StudentModal({ student, onClose }) {
  if (!student) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <section className="student-modal">
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close profile">
          <X size={20} />
        </button>

        <div className="modal-hero">
          <span className="avatar modal-avatar">{student.avatar}</span>
          <div>
            <p className="eyebrow">{student.id}</p>
            <h2>{student.name}</h2>
            <p>{student.course}</p>
          </div>
        </div>

        <div className="profile-stats">
          <div>
            <Award size={20} />
            <span>Grade</span>
            <strong>{student.grade}</strong>
          </div>
          <div>
            <Users size={20} />
            <span>Attendance</span>
            <strong>{student.attendance}</strong>
          </div>
          <div>
            <Mail size={20} />
            <span>Email</span>
            <strong>{student.email}</strong>
          </div>
        </div>

        <div className="modal-skills">
          <h3>Skills</h3>
          <div className="skill-list">
            {student.skills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Toast({ message }) {
  if (!message) {
    return null;
  }

  return (
    <div className="toast">
      <Sparkles size={18} />
      <span>{message}</span>
    </div>
  );
}

function App() {
  const { favouriteStudents } = useStudents();
  const [theme, setTheme] = useState(() => localStorage.getItem("student-theme") || "berry");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const toastTimer = useRef(null);

  useEffect(() => {
    localStorage.setItem("student-theme", theme);
  }, [theme]);

  function showToast(message) {
    setToastMessage(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastMessage(""), 2400);
  }

  return (
    <div className="app-shell" data-theme={theme}>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <nav className="navbar">
        <Link className="brand" to="/">
          <Users size={24} />
          Favourite Student List
        </Link>

        <div className="navbar-actions">
          <div className="theme-switcher" aria-label="Choose theme">
            <Palette size={18} />
            <button
              className={theme === "berry" ? "theme-dot active" : "theme-dot"}
              type="button"
              onClick={() => setTheme("berry")}
              aria-label="Berry theme"
            />
            <button
              className={theme === "ocean" ? "theme-dot ocean active" : "theme-dot ocean"}
              type="button"
              onClick={() => setTheme("ocean")}
              aria-label="Ocean theme"
            />
            <button
              className={theme === "midnight" ? "theme-dot midnight active" : "theme-dot midnight"}
              type="button"
              onClick={() => setTheme("midnight")}
              aria-label="Midnight theme"
            />
          </div>

          <div className="nav-links">
            <NavLink to="/" end>
              <Home size={18} />
              Students
            </NavLink>
            <NavLink to="/favourites">
              <Heart size={18} />
              Favourites
              <span className="count">{favouriteStudents.length}</span>
            </NavLink>
          </div>
        </div>
      </nav>
      
      <Routes>
        <Route
          path="/"
          element={<StudentListPage onOpenProfile={setSelectedStudent} onAddToast={showToast} />}
        />
        <Route
          path="/favourites"
          element={<FavouriteStudentsPage onOpenProfile={setSelectedStudent} onAddToast={showToast} />}
        />
      </Routes>

      <StudentModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />
      <Toast message={toastMessage} />
    </div>
  );
}

export default App;
