import { useEffect, useState } from 'react';
import './App.css';
import Conversor from './Conversor';
import Usuarios from './Usuarios';
import Registro from './Registro';

function App() {
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [usuarioRegistro, setUsuarioRegistro] = useState('');
  const [claveRegistro, setClaveRegistro] = useState('');
  const [logueado, setLogueado] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [rol, setRol] = useState('');

  function cambiarUsuarioRegistro(evento) {
    setUsuarioRegistro(evento.target.value);
  }

  function cambiarClaveRegistro(evento) {
    setClaveRegistro(evento.target.value);
  }

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
      ? 'https://loginexpress-1-8pdh.onrender.com'  // URL de tu backend en producción
      : 'http://localhost:10000';  // URL de tu backend en desarrollo

      const peticion = await fetch(`${BASE_URL}/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    usuario: usuario,
    clave: clave,
  }),
        credentials: 'include',  // Mantener la cookie de sesión
      });
      
      if (peticion.ok) {
        const datos = await peticion.json();
        if (datos.rol === 'ADMINISTRADOR') {
          setRol('ADMINISTRADOR');
        } else {
          setRol('USUARIO');
        }
        setLogueado(true);
        obtenerUsuarios();
      } else {
        alert('Usuario o clave incorrectos');
      }
    } catch (error) {
      console.error('Error al intentar ingresar:', error);
      alert('Hubo un problema al iniciar sesión.');
    }
  }

  async function registrar() {
    try {
      const peticion = await fetch('http://localhost:10000/registrar' || 'http://localhost:3000/registrar' || 'https://loginexpress-1-8pdh.onrender.com/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario: usuarioRegistro,  // Asegúrate de que esta variable contenga el valor correcto
          clave: claveRegistro,      // Lo mismo para esta variable
        }),
      });
  
      if (peticion.ok) {
        alert('Usuario registrado');
      } else {
        alert('Error al registrar el usuario');
      }
    } catch (error) {
      console.error('Error en el registro:', error);
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
    }
  }

  if (logueado) {
    return (
      <>
        <Registro recargarAhora={() => setUsuarios([])} />
        <Conversor />
        <Usuarios recargar={() => obtenerUsuarios()} />
      </>
    );
  }

  return (
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
  );
}

export default App;