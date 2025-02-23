import { useEffect, useState } from 'react';
import './App.css';
import { FaTrash, FaEdit } from 'react-icons/fa';

function Usuarios({ usuarios, eliminarUsuario, recargarUsuarios }) {
    const [usuariosState, setUsuariosState] = useState(usuarios);
    const [edicionUsuario, setEdicionUsuario] = useState({});
    const [cambioRol, setCambioRol] = useState({});

    const BASE_URL = process.env.NODE_ENV === 'production'
        ? 'https://conversorreactback.onrender.com'
        : 'http://localhost:10000';

    useEffect(() => {
        setUsuariosState(usuarios);
    }, [usuarios]);

    async function cambiarRol(id, nuevoRol) {
        try {
            const response = await fetch(`${BASE_URL}/usuario/${id}/rol`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ rol: nuevoRol }),
                credentials: 'include',  // Asegúrate de que la autenticación esté incluida
            });
    
            if (!response.ok) {
                throw new Error(`Error al cambiar el rol: ${response.statusText}`);
            }
    
            const data = await response.json();
            console.log("Rol actualizado:", data);
            recargarUsuarios();  // Recarga la lista de usuarios después de actualizar el rol
        } catch (error) {
            console.error("Error en cambiarRol:", error);
        }
    }

    async function guardarEdicion(id) {
        const nuevoUsuario = edicionUsuario[id];
        const nuevoRol = cambioRol[id];

        if (!nuevoUsuario) {
            alert("El nombre de usuario no puede estar vacío");
            return;
        }

        try {
            const respuesta = await fetch(`${BASE_URL}/usuario/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario: nuevoUsuario, clave: '123456', rol: nuevoRol }),
                credentials: 'include',
            });

            if (respuesta.ok) {
                setUsuariosState((prevUsuarios) =>
                    prevUsuarios.map((user) =>
                        user.id === id ? { ...user, usuario: nuevoUsuario, rol: nuevoRol } : user
                    )
                );
                setEdicionUsuario((prev) => {
                    const newState = { ...prev };
                    delete newState[id];
                    return newState;
                });
                alert("Usuario actualizado exitosamente");
            } else {
                alert('Error al actualizar el usuario');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <div>
            <h2>Lista de Usuarios</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Usuario</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuariosState.length > 0 ? (
                        usuariosState.map((usuario) => (
                            <tr key={usuario.id}>
                                <td>{usuario.id}</td>
                                <td>
                                    {edicionUsuario[usuario.id] !== undefined ? (
                                        <input
                                            type="text"
                                            value={edicionUsuario[usuario.id]}
                                            onChange={(e) =>
                                                setEdicionUsuario({
                                                    ...edicionUsuario,
                                                    [usuario.id]: e.target.value,
                                                })
                                            }
                                        />
                                    ) : (
                                        usuario.usuario
                                    )}
                                </td>
                                <td>
                                    <select
                                        value={cambioRol[usuario.id] || usuario.rol || 'USUARIO'}
                                        onChange={(e) => cambiarRol(usuario.id, e.target.value)}
                                    >
                                        <option value="USUARIO">Usuario</option>
                                        <option value="ADMINISTRADOR">Administrador</option>
                                    </select>
                                </td>
                                <td>
                                    <button onClick={() => eliminarUsuario(usuario.id)}>
                                        <FaTrash color="red" />
                                    </button>
                                    {edicionUsuario[usuario.id] !== undefined ? (
                                        <button onClick={() => guardarEdicion(usuario.id)}>✅</button>
                                    ) : (
                                        <button onClick={() => setEdicionUsuario({ ...edicionUsuario, [usuario.id]: usuario.usuario })}>✏️</button>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No hay usuarios registrados</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Usuarios;