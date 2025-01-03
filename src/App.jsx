import { useEffect, useState } from 'react';
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

  function cambiarUsuario(evento) {
    setUsuario(evento.target.value);
  }

  function cambiarClave(evento) {
    setClave(evento.target.value);
  }

  async function ingresar(event) {
    event.preventDefault(); // Evita que el formulario recargue la página

    try {
      const BASE_URL = process.env.NODE_ENV === 'production'
        ? 'https://loginexpress-1-8pdh.onrender.com'
        : 'http://localhost:10000';

      const peticion = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario: usuario,
          clave: clave,
        }),
        credentials: 'include',
      });

      if (peticion.ok) {
        const datos = await peticion.json();
        if (datos.rol === 'ADMINISTRADOR') {
          setRol('ADMINISTRADOR');
          obtenerUsuarios();
        } else {
          setRol('USUARIO');
        }
        setLogueado(true);
      } else {
        alert('Usuario o clave incorrectos');
      }
    } catch (error) {
      console.error('Error al intentar ingresar:', error);
      alert('Hubo un problema al iniciar sesión.');
    }
  }

  async function validar() {
    const peticion = await fetch('/validar', { credentials: 'include' });
    if (peticion.ok) {
      setLogueado(true);
      obtenerUsuarios();
    }
  }

  async function obtenerUsuarios() {
    const peticion = await fetch('/usuarios', { credentials: 'include' });
    if (peticion.ok) {
      setUsuarios(await peticion.json());
    }
  }

  useEffect(() => {
    validar();
  }, []);

  async function eliminarUsuario(id) {
    const peticion = await fetch('/usuarios?id=' + id, { credentials: 'include', method: 'DELETE' });
    if (peticion.ok) {
      alert('Usuario eliminado');
      obtenerUsuarios(); // Actualiza la lista después de eliminar
    }
  }

  if (logueado) {
    return (
      <>
        <Conversor />
        {rol === 'ADMINISTRADOR' && (
          <>
            <h2>Lista de Usuarios</h2>
            <Usuarios usuarios={usuarios} eliminarUsuario={eliminarUsuario} />
            <Registro recargarAhora={obtenerUsuarios} />
          </>
        )}
      </>
    );
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={ingresar}>
        <input
          placeholder="Usuario"
          type="text"
          name="usuario"
          id="usuario"
          value={usuario}
          onChange={cambiarUsuario}
        />
        <input
          placeholder="Clave"
          type="password"
          name="clave"
          id="clave"
          value={clave}
          onChange={cambiarClave}
        />
        <button type="submit">Ingresar</button>
      </form>
      <Registro recargarAhora={obtenerUsuarios} />
    </div>
  );
}

export default App;