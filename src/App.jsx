import { useEffect, useState } from 'react'
import './App.css'
import Conversor from './Conversor'
import Usuarios from './Usuarios'
import Registro from './Registro'

function App() {
  const [usuario, setUsuario] = useState('')
  const [clave, setClave] = useState('')
  const [usuarioRegistro, setUsuarioRegistro] = useState('')
  const [claveRegistro, setClaveRegistro] = useState('')
  const [logueado, setLogueado] = useState(false)
  const [usuarios, setUsuarios] = useState([])
  const [rol, setRol] = useState('')
  //const [recargar, setRecargar] = useState(false)

  function cambiarUsuarioRegistro(evento) {
    setUsuarioRegistro(evento.target.value)
  }

  function cambiarClaveRegistro(evento) {
    setClaveRegistro(evento.target.value)
  }

  function cambiarUsuario(evento) {
    setUsuario(evento.target.value)
  }

  function cambiarClave(evento) {
    setClave(evento.target.value)
  }

  /* function recargarAhora() {
    setRecargar(!recargar)
  } */

  async function ingresar() {
    const peticion = await fetch('https://loginexpress-1-8pdh.onrender.com/login?usuario=' + usuario + '&clave=' + clave, { credentials: 'include' })
    if (peticion.ok) {
      const datos = await peticion.json();
      if (datos.rol == 'ADMINISTRADOR') {
        setRol('ADMINISTRADOR')
      } else {
        setRol('USUARIO')
      }
      setLogueado(true)
      obtenerUsuarios()
    } else {
      alert('Usuario o clave incorrectos')
    }
  }

  async function registro() {
    const peticion = await fetch('https://loginexpress-1-8pdh.onrender.com/registrar?usuario=' + usuarioRegistro + '&clave=' + claveRegistro)
    if (peticion.ok) {
      alert('Usuario registrado')
      setLogueado(true)
      obtenerUsuarios()
    } else {
      alert('No se pudo registrar el usuario')
    }
  }

  async function validar() {
    const peticion = await fetch('https://loginexpress-1-8pdh.onrender.com/validar', { credentials: 'include' })
    if (peticion.ok) {
      setLogueado(true)
      obtenerUsuarios()
    }
  }

  async function obtenerUsuarios() {
    const peticion = await fetch('https://loginexpress-1-8pdh.onrender.com/usuarios', { credentials: 'include' })
    if (peticion.ok) {
      setUsuarios((await peticion.json()))
    }
  }

  useEffect(() => {
    validar()
  }, [])

  async function eliminarUsuario(id) {
    const peticion = await fetch('https://loginexpress-1-8pdh.onrender.com/usuarios?id=' + id, { credentials: 'include', method: 'DELETE' })
    if (peticion.ok) {
      alert('Usuario eliminado')
    }
  }
  /*
    if (logueado) {
      return (
  
        <>
          <Registro recargarAhora={recargarAhora} />
          <Conversor />
          <Usuarios recargar={recargar} />
        </>)
    }
  
    return (
      <>
        <h1>Inicio de sesión</h1>
        <input placeholder='Usuario' type="text" name="usuario" id="usuario" value={usuario} onChange={cambiarUsuario} />
        <input placeholder='Clave' type="password" name="clave" id="clave" value={clave} onChange={cambiarClave} />
        <button onClick={ingresar}>Ingresar</button>
  
      </>
    )
  } */
}

export default App;