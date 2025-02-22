import { useEffect, useState } from 'react';
import './App.css';
import { FaTrash, FaEdit } from 'react-icons/fa';

function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [cambioRol, setCambioRol] = useState({});
    const [edicionUsuario, setEdicionUsuario] = useState({});

    const BASE_URL = process.env.NODE_ENV === 'production'
        ? 'https://conversorreactback.onrender.com'
        : 'http://localhost:10000';

    // Obtener usuarios de la base de datos
    useEffect(() => {
        async function obtenerUsuarios() {
            try {
                const respuesta = await fetch(`${BASE_URL}/usuarios`, { credentials: 'include' });
                console.log('Respuesta del servidor:', respuesta); // Agrega esto para depuración
    
                if (respuesta.ok) {
                    const data = await respuesta.json();
                    console.log('Usuarios recibidos:', data); // Verifica la respuesta
                    setUsuarios(data.usuarios || []); // Asegúrate de que existe `data.usuarios` o es un array vacío
                } else {
                    console.error('Error al obtener usuarios:', respuesta.status);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
        obtenerUsuarios();
    }, []);

    async function cambiarRol(id, nuevoRol) {
        try {
            const response = await fetch(`https://conversorreactback.onrender.com/usuario/${id}/rol`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ rol: nuevoRol }),
            });
    
            if (!response.ok) {
                throw new Error(`Error al cambiar el rol: ${response.statusText}`);
            }
    
            const data = await response.json();
            console.log("Rol actualizado:", data);
            cargarUsuarios(); // Asegurar que la lista se actualice
        } catch (error) {
            console.error("Error en cambiarRol:", error);
        }
    }

    async function eliminarUsuario(id) {
        try {
            const respuesta = await fetch(`${BASE_URL}/usuarios?id=` + id, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (respuesta.ok) {
                alert('Usuario eliminado');
                setUsuarios(usuarios.filter((user) => user.id !== id));
            } else {
                alert('Error al eliminar el usuario');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function habilitarEdicion(id, usuarioActual) {
        console.log("Editando usuario con ID:", id, usuarioActual);
        setEdicionUsuario({ ...edicionUsuario, [id]: usuarioActual.usuario }); // Asegurar que solo almacena el string
    }

    async function guardarEdicion(id) {
        const nuevoUsuario = edicionUsuario[id];

        if (!nuevoUsuario) {
            alert("El nombre de usuario no puede estar vacío");
            return;
        }

        try {
            const respuesta = await fetch(`${BASE_URL}/usuario/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario: nuevoUsuario, clave: '123456' }), // Clave por defecto o pedirla
                credentials: 'include',
            });

            if (respuesta.ok) {
                setUsuarios((prevUsuarios) =>
                    prevUsuarios.map((user) =>
                        user.id === id ? { ...user, usuario: nuevoUsuario } : user
                    )
                );
                setEdicionUsuario({ ...edicionUsuario, [id]: null });
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
                    {usuarios.length > 0 ? (
                        usuarios.map((usuario) => (
                            <tr key={usuario.id}>
                                <td>{usuario.id}</td>
                                <td>
                                    {edicionUsuario[usuario.id] !== undefined ? (
                                        <input
                                            type="text"
                                            value={edicionUsuario[usuario.id] ?? usuario.usuario} // Asegurar que siempre sea un string
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
                                        <button onClick={() => habilitarEdicion(usuario.id, usuario)}>✏️</button>
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