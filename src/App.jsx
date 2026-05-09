import { useEffect, useRef, useState } from "react";
import { Link, Navigate, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { Award, Heart, Home, LogOut, Mail, Palette, Sparkles, UserRound, Users, X } from "lucide-react";
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

function LoginPage({ users, onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginFailed, setLoginFailed] = useState(false);
  const navigate = useNavigate();

  function checkUser() {
    const foundUser = users.some((user) => {
      return user.username === username.trim() && user.password === password.trim();
    });

    if (foundUser) {
      onLogin(username.trim());
      setLoginFailed(false);
      navigate("/");
    } else {
      setLoginFailed(true);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">Welcome Back</p>
        <h1>Hey Hi</h1>
        {loginFailed ? (
          <p className="auth-error">Please signup before login</p>
        ) : (
          <p>I help you manage your favourite students after you login.</p>
        )}

        <div className="auth-form">
          <input
            type="text"
            name="login-username"
            placeholder="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="off"
          />
          <input
            type="password"
            name="login-password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
          />
          <button className="primary-button" type="button" onClick={checkUser}>
            Login
          </button>
          <p>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

function SignupPage({ setUsers }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function addUser() {
    if (!username.trim() || !password.trim()) {
      setError("Please enter username and password");
      return;
    }

    if (password.trim() !== confirmPassword.trim()) {
      setError("Passwords do not match");
      return;
    }

    setUsers((currentUsers) => [
      ...currentUsers,
      { username: username.trim(), password: password.trim() }
    ]);
    navigate("/login");
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">Create Account</p>
        <h1>Hey Hi</h1>
        {error ? (
          <p className="auth-error">{error}</p>
        ) : (
          <p>Signup once and start building your favourite student list.</p>
        )}

        <div className="auth-form">
          <input
            type="text"
            name="signup-username"
            placeholder="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="off"
          />
          <input
            type="password"
            name="signup-password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
          />
          <input
            type="password"
            name="signup-confirm-password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
          />
          <button className="primary-button" type="button" onClick={addUser}>
            Sign Up
          </button>
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

function ProtectedRoute({ loggedInUser, children }) {
  if (!loggedInUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
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
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem("student-users");

    if (savedUsers) {
      return JSON.parse(savedUsers);
    }

    return [{ username: "alwin", password: "12345" }];
  });
  const [loggedInUser, setLoggedInUser] = useState(() => localStorage.getItem("student-login") || "");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const toastTimer = useRef(null);

  useEffect(() => {
    localStorage.setItem("student-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("student-users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (loggedInUser) {
      localStorage.setItem("student-login", loggedInUser);
    } else {
      localStorage.removeItem("student-login");
    }
  }, [loggedInUser]);

  function showToast(message) {
    setToastMessage(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastMessage(""), 2400);
  }

  return (
    <div className="app-shell" data-theme={theme}>
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
            {loggedInUser ? (
              <span className="user-pill">
                <UserRound size={18} />
                {loggedInUser}
              </span>
            ) : null}
            <NavLink to="/" end>
              <Home size={18} />
              Students
            </NavLink>
            <NavLink to="/favourites">
              <Heart size={18} />
              Favourites
              <span className="count">{favouriteStudents.length}</span>
            </NavLink>
            {loggedInUser ? (
              <button className="logout-button" type="button" onClick={() => setLoggedInUser("")}>
                <LogOut size={18} />
                Logout
              </button>
            ) : null}
          </div>
        </div>
      </nav>
      
      <Routes>
        <Route path="/login" element={<LoginPage users={users} onLogin={setLoggedInUser} />} />
        <Route path="/signup" element={<SignupPage setUsers={setUsers} />} />
        <Route
          path="/"
          element={
            <ProtectedRoute loggedInUser={loggedInUser}>
              <StudentListPage onOpenProfile={setSelectedStudent} onAddToast={showToast} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favourites"
          element={
            <ProtectedRoute loggedInUser={loggedInUser}>
              <FavouriteStudentsPage onOpenProfile={setSelectedStudent} onAddToast={showToast} />
            </ProtectedRoute>
          }
        />
      </Routes>

      <StudentModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />
      <Toast message={toastMessage} />
    </div>
  );
}

export default App;
