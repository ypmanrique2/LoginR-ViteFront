import { useState } from "react";
import "./App.css";

function Usuarios({ usuarios, eliminarUsuario, recargarUsuarios }) {
  const BASE_URL =
    process.env.NODE_ENV === "production"
      ? "https://conversorreactback.onrender.com"
      : "http://localhost:10000";

  const [editandoId, setEditandoId] = useState(null);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoRol, setNuevoRol] = useState("");
  const [nuevoUsuario, setNuevoUsuario] = useState("");
  const [nuevaClave, setNuevaClave] = useState("");

  const iniciarEdicion = (usuario) => {
    setEditandoId(usuario.id);
    setNuevoNombre(usuario.nombre);
    setNuevoRol(usuario.rol);
    setNuevoUsuario(usuario.usuario);
    setNuevaClave(""); // No mostramos la clave original por seguridad
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
  };

  const confirmarEdicion = async () => {
    if (!nuevoNombre.trim() || !nuevoRol || !nuevoUsuario.trim() || !nuevaClave.trim()) {
      alert("Por favor, complete todos los campos antes de confirmar.");
      return;
    }

    const confirmacion = window.confirm(
      `¿Deseas guardar los siguientes cambios?\n\nNombre: ${nuevoNombre}\nRol: ${nuevoRol}\nUsuario: ${nuevoUsuario}\nClave: (Oculta por seguridad)`
    );
    if (!confirmacion) return;

    const respuesta = await fetch(`${BASE_URL}/usuario/${editandoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ nombre: nuevoNombre, rol: nuevoRol, usuario: nuevoUsuario, clave: nuevaClave }),
    });

    if (respuesta.ok) {
      alert("Usuario actualizado correctamente");
      recargarUsuarios();
    } else {
      alert("Error al actualizar usuario");
    }
    cancelarEdicion();
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Clave</th>
            <th>Rol</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>
                {editandoId === user.id ? (
                  <input type="text" value={nuevoUsuario} onChange={(e) => setNuevoUsuario(e.target.value)} />
                ) : (
                  user.usuario
                )}
              </td>
              <td>
                {editandoId === user.id ? (
                  <input type="password" value={nuevaClave} onChange={(e) => setNuevaClave(e.target.value)} />
                ) : (
                  "●●●●●"
                )}
              </td>
              <td>
                {editandoId === user.id ? (
                  <select value={nuevoRol} onChange={(e) => setNuevoRol(e.target.value)}>
                    <option value="ADMINISTRADOR">ADMINISTRADOR</option>
                    <option value="USUARIO">USUARIO</option>
                  </select>
                ) : (
                  user.rol
                )}
              </td>
              <td>
                {editandoId === user.id ? (
                  <input type="text" value={nuevoNombre} onChange={(e) => setNuevoNombre(e.target.value)} />
                ) : (
                  user.nombre
                )}
              </td>
              <td>
                {editandoId === user.id ? (
                  <>
                    <button style={{ backgroundColor: "green", color: "white" }} onClick={confirmarEdicion}>
                      ✔️ Guardar
                    </button>
                    <button onClick={cancelarEdicion}>❌ Cancelar</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => iniciarEdicion(user)}>✏️ Editar</button>
                    <button onClick={() => eliminarUsuario(user.id)}>🗑️ Eliminar</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Usuarios;