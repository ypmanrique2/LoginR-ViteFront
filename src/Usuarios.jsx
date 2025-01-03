import { useEffect, useState } from 'react'
import './App.css'

// eslint-disable-next-line react/prop-types
function Usuarios({ recargar }) {
  const [usuarios, setUsuarios] = useState([])

  async function obtenerUsuarios() {
    const peticion = await fetch('https://loginexpress-1-8pdh.onrender.com/usuarios', { credentials: 'include' })
    if (peticion.ok) {
      const respuesta = await peticion.json()
      setUsuarios(respuesta)
    }
  }

  async function eliminarUsuario(id) {
    const peticion = await fetch('https://loginexpress-1-8pdh.onrender.com/usuarios?id=' + id, { credentials: 'include', method: 'DELETE' })
    if (peticion.ok) {
      alert('Usuario eliminado')
      obtenerUsuarios();
    }
  }

  useEffect(() => {
    obtenerUsuarios()
  }, [recargar])

  return (
    <>

      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Usuario</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {
            usuarios.map(usuario => (
              <tr key={usuario.id}>
                <th>{usuario.id}</th>
                <th>{usuario.usuario}</th>
                <th>{usuario.rol}</th>
                <th>
                  <button
                    onClick={() => { eliminarUsuario(usuario.id) }}
                  >X</button>
                </th>
              </tr>
            ))
          }
        </tbody>
      </table>

    </>
  )
}

export default Usuarios
