import { useState } from 'react';

function Registro({ recargarAhora, esAdmin }) {
    const [usuario, setUsuario] = useState('');
    const [clave, setClave] = useState('');
    const [nombre, setNombre] = useState('');
    const [rol, setRol] = useState('USUARIO'); // Por defecto, todos son USUARIO

    async function registrar(event) {
        event.preventDefault();
        const body = esAdmin ? { usuario, clave, rol, nombre } : { usuario, clave, nombre }; // Solo los ADMIN envían rol
    
        try {
            const respuesta = await fetch('https://conversorreactback.onrender.com/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
                credentials: 'include',
            });
    
            if (respuesta.ok) {
                alert('Usuario registrado');
                setUsuario('');
                setClave('');
                setNombre('');
                setRol('USUARIO'); // Resetear a USUARIO por defecto
                recargarAhora();
            } else {
                const errorData = await respuesta.json();  // Esto obtiene la respuesta del error
                console.error('Error al registrar usuario:', errorData);
                alert('Error al registrar usuario');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Ocurrió un error al intentar registrar el usuario');
        }
    }

    return (
        <form onSubmit={registrar}>
            <input type="text" placeholder="Usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
            <input type="password" placeholder="Clave" value={clave} onChange={(e) => setClave(e.target.value)} />
            <input type="text" placeholder="Nombre (Opcional)" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            {esAdmin && (
                <select value={rol} onChange={(e) => setRol(e.target.value)}>
                    <option value="USUARIO">Usuario</option>
                    <option value="ADMINISTRADOR">Administrador</option>
                </select>
            )}
            
            <button type="submit">Registrar</button>
        </form>
    );
}

export default Registro;
