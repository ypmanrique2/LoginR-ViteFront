import { useState } from 'react';

function Usuarios({ usuarios, eliminarUsuario, recargarUsuarios }) {
    const BASE_URL = process.env.NODE_ENV === 'production'
        ? 'https://conversorreactback.onrender.com'
        : 'http://localhost:10000';

    const [usuarioEdit, setUsuarioEdit] = useState(null);
    const [nuevoNombre, setNuevoNombre] = useState('');
    const [nuevoRol, setNuevoRol] = useState('');
    const [mostrarModal, setMostrarModal] = useState(false);

    const abrirModal = (usuario) => {
        setUsuarioEdit(usuario);
        setNuevoNombre(usuario.nombre);
        setNuevoRol(usuario.rol);
        setMostrarModal(true);
    };

    const cerrarModal = () => {
        setMostrarModal(false);
    };

    async function actualizarUsuario() {
        const respuesta = await fetch(`${BASE_URL}/usuario/${usuarioEdit.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ nombre: nuevoNombre, rol: nuevoRol })
        });

        if (respuesta.ok) {
            alert('Usuario actualizado');
            recargarUsuarios();
        } else {
            alert('Error al actualizar usuario');
        }
        cerrarModal();
    }

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
                            <td>{user.nombre}</td>
                            <td>{user.rol}</td>
                            <td>
                                <button onClick={() => abrirModal(user)}>✏️ Editar</button>
                                <button onClick={() => eliminarUsuario(user.id)}>🗑️ Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {mostrarModal && (
                <div className="modal">
                    <h3>Editar Usuario</h3>
                    <label>Nombre:
                        <input
                            type="text"
                            value={nuevoNombre}
                            onChange={(e) => setNuevoNombre(e.target.value)}
                        />
                    </label>
                    <label>Rol:
                        <select value={nuevoRol} onChange={(e) => setNuevoRol(e.target.value)}>
                            <option value="ADMINISTRADOR">ADMINISTRADOR</option>
                            <option value="USUARIO">USUARIO</option>
                        </select>
                    </label>
                    <button onClick={actualizarUsuario}>Confirmar</button>
                    <button onClick={cerrarModal}>Cancelar</button>
                </div>
            )}
        </div>
    );
}

export default Usuarios;