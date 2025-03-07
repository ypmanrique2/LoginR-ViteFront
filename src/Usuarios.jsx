import { useState } from 'react';
import './App.css';

function Usuarios({ usuarios, eliminarUsuario, recargarUsuarios }) {
    const BASE_URL = process.env.NODE_ENV === 'production'
        ? 'https://conversorreactback.onrender.com'
        : 'http://localhost:10000';

    const [usuarioEdit, setUsuarioEdit] = useState(null);
    const [nuevoNombre, setNuevoNombre] = useState('');
    const [nuevoRol, setNuevoRol] = useState('');
    const [editandoId, setEditandoId] = useState(null);

    const iniciarEdicion = (usuario) => {
        setEditandoId(usuario.id);
        setNuevoNombre(usuario.nombre);
        setNuevoRol(usuario.rol);
    };

    const cancelarEdicion = () => {
        setEditandoId(null);
    };

    const confirmarEdicion = async () => {
        if (!nuevoNombre.trim() || !nuevoRol) {
            alert("Por favor, complete todos los campos antes de confirmar.");
            return;
        }

        const confirmacion = window.confirm(
            `¿Deseas guardar los siguientes cambios?\n\nNombre: ${nuevoNombre}\nRol: ${nuevoRol}`
        );
        if (!confirmacion) return;

        const respuesta = await fetch(`${BASE_URL}/usuario/${editandoId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ nombre: nuevoNombre, rol: nuevoRol })
        });

        if (respuesta.ok) {
            alert('Usuario actualizado correctamente');
            recargarUsuarios();
        } else {
            alert('Error al actualizar usuario');
        }
        cancelarEdicion();
    };

    return (
        <div>
            <h2>Lista de Usuarios</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Usuario</th>
                        <th>Nombre</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.usuario}</td>
                            <td>
                                {editandoId === user.id ? (
                                    <input
                                        type="text"
                                        value={nuevoNombre}
                                        onChange={(e) => setNuevoNombre(e.target.value)}
                                    />
                                ) : (
                                    user.nombre
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
                                    <>
                                        <button style={{ backgroundColor: 'green', color: 'white' }} onClick={confirmarEdicion}>✔️ Guardar</button>
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