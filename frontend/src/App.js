import { useState } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import api from "./api";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const [msg, setMsg] = useState("");

  const login = async (e) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      return alert("Completa campos");
    }

    try {
      const res = await api.post("/api/auth/signin", form);

      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch {
      alert("Credenciales inválidas");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setMsg("");
  };

  const loadProtected = async () => {
    try {
      const res = await api.get("/api/test/user", {
        headers: {
          Authorization: `Bearer ${user.accessToken}`
        }
      });

      setMsg(res.data);
    } catch {
      setMsg("Acceso denegado");
    }
  };

  return (
    <BrowserRouter>
      <div className="app">

        <nav className="navbar">
          <Link to="/">Inicio</Link>

          {!user ? (
            <Link to="/login">Login</Link>
          ) : (
            <>
              <Link to="/user">Usuario</Link>
              <button onClick={logout}>Cerrar sesión</button>
            </>
          )}
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <div className="card">
                <h1>Tareas Floppa :v</h1>

                {user ? (
                  <>
                    <h2>{user.username}</h2>
                    <p>{user.roles.join(", ")}</p>
                  </>
                ) : (
                  <p>Bienvenido.</p>
                )}
              </div>
            }
          />

          <Route
            path="/login"
            element={
              !user ? (
                <form className="card" onSubmit={login}>
                  <h1>Login</h1>

                  <input
                    placeholder="Usuario"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        username: e.target.value
                      })
                    }
                  />

                  <input
                    type="password"
                    placeholder="Contraseña"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        password: e.target.value
                      })
                    }
                  />

                  <button>Iniciar sesión</button>
                </form>
              ) : (
                <Navigate to="/" />
              )
            }
          />

          <Route
            path="/user"
            element={
              user ? (
                <div className="card">
                  <h1>Zona Usuario</h1>

                  <button onClick={loadProtected}>
                    Obtener contenido
                  </button>

                  <p className="message">{msg}</p>
                </div>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}