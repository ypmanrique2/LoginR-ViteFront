import React, { useEffect, useState } from 'react';
import './App.css';
import Conversor from './Conversor';
import Usuarios from './Usuarios';
import Registro from './Registro';

function App() {
    const [usuario, setUsuario] = useState('');
    const [clave, setClave] = useState('');
    const [logueado, setLogueado] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [rol, setRol] = useState('');
    const [esAdmin, setEsAdmin] = useState(false);  // Agregamos el estado para el rol de admin

    const BASE_URL = process.env.REACT_APP_BASE_URL || 'https://conversorreactback.onrender.com';

    async function ingresar(event) {
        event.preventDefault();
        try {
            const peticion = await fetch(`${BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario, clave }),
                credentials: 'include',
            });

            if (peticion.ok) {
                const datos = await peticion.json();
                setRol(datos.rol);
                setLogueado(true);
                if (datos.rol === 'ADMINISTRADOR') obtenerUsuarios();
            } else {
                alert('Usuario o clave incorrectos');
            }
        } catch (error) {
            console.error('Error al intentar ingresar:', error);
            alert('Hubo un problema al iniciar sesión.');
        }
    }

    async function obtenerUsuarios() {
        try {
            const peticion = await fetch(`${BASE_URL}/usuarios`, { credentials: 'include' });
            if (peticion.ok) {
                setUsuarios(await peticion.json());
            } else {
                alert('Error al obtener usuarios');
            }
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            alert('Hubo un problema al obtener los usuarios.');
        }
    }

    async function eliminarUsuario(id) {
        const peticion = await fetch(`${BASE_URL}/usuarios?id=` + id, {
            credentials: 'include',
            method: 'DELETE'
        });
        if (peticion.ok) {
            alert('Usuario eliminado');
            obtenerUsuarios();
        }
    }

    useEffect(() => {
        async function validar() {
            try {
                const peticion = await fetch(`${BASE_URL}/validar`, { credentials: 'include' });
                if (peticion.ok) {
                    const datos = await peticion.json();
                    if (datos.logueado) {
                        setLogueado(true);
                        setRol(datos.rol);
                        if (datos.rol === 'ADMINISTRADOR') obtenerUsuarios();
                    }
                }
            } catch (error) {
                console.error("Error al validar sesión:", error);
            }
        }
        validar();
    }, []);

    return (
        <main className="container">
            <img width="50" src="https://img.freepik.com/vector-gratis/vector-degradado-logotipo-colorido-pajaro_343694-1365.jpg" alt="Logo" />

            {!logueado ? (
                <section>
                    <h1>Conversor TTS y STT</h1>
                    <h3>Ingresar</h3>
                    <form onSubmit={ingresar}>
                        <label>Usuario:
                            <input type="text" value={usuario} onChange={(e) => setUsuario(e.target.value)} required />
                        </label>
                        <label>Contraseña:
                            <input type="password" value={clave} onChange={(e) => setClave(e.target.value)} required />
                        </label>
                        <button type="submit">Login</button>
                    </form>
                    <h3>Registrar</h3>
                    <Registro recargarAhora={obtenerUsuarios} />
                </section>
            ) : (
                <section>
                    <h1>Conversor TTS y STT</h1>
                    <Conversor />
                    {rol === 'ADMINISTRADOR' && (
                        <>
                            <h2>Lista de Usuarios</h2>
                            <Usuarios usuarios={usuarios} eliminarUsuario={eliminarUsuario} recargarUsuarios={obtenerUsuarios} />
                            <Registro recargarAhora={obtenerUsuarios} esAdmin={true} />
                        </>
                    )}
                </section>
            )}
        </main>
    );
}

export default App;