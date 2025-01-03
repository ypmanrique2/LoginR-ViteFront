import { useEffect, useState } from 'react'
import './App.css'

// eslint-disable-next-line react/prop-types
function Registro({ recargarAhora }) {
  const [usuarioRegistro, setUsuarioRegistro] = useState('')
  const [claveRegistro, setClaveRegistro] = useState('')

  function cambiarUsuarioRegistro(evento) {
    setUsuarioRegistro(evento.target.value)
  }

  function cambiarClaveRegistro(evento) {
    setClaveRegistro(evento.target.value)
  }

  async function registrar() {
    try {
      const peticion = await fetch('https://loginexpress-1-8pdh.onrender.com/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario: usuarioRegistro,
          clave: claveRegistro,
        }),
        credentials: 'include', // Asegura que las cookies de sesión se envíen
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

  useEffect(() => {
  }, [])

  return (
    <>
      <h1>Registro</h1>
      <input placeholder='Usuario' type="text" name="usuario" id="usuario" value={usuarioRegistro} onChange={cambiarUsuarioRegistro} />
      <input placeholder='Clave' type="password" name="clave" id="clave" value={claveRegistro} onChange={cambiarClaveRegistro} />
      <button onClick={registrar}>Registrar</button>
    </>
  )
}

export default Registro;