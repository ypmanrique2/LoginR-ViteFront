import React, { useState } from "react";

const Registro = ({ recargarAhora }) => {
  const [usuarioRegistro, setUsuarioRegistro] = useState('');
  const [claveRegistro, setClaveRegistro] = useState('');
  const [registroExitoso, setRegistroExitoso] = useState(false);

  const registrar = async () => {
    try {
      const peticion = await fetch('https://loginexpress-1-8pdh.onrender.com/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usuario: usuarioRegistro, clave: claveRegistro }),
        credentials: 'include',
      });

      if (peticion.ok) {
        setRegistroExitoso(true);
        alert('Usuario registrado');
        recargarAhora();  // Actualizar la lista de usuarios después del registro
      } else {
        alert('Error al registrar el usuario');
      }
    } catch (error) {
      console.error('Error en el registro:', error);
    }
  };

  return (
    <div>
      <h2>Registro de Usuario</h2>
      {!registroExitoso && (
        <form>
          <input
            type="text"
            value={usuarioRegistro}
            onChange={(e) => setUsuarioRegistro(e.target.value)}
            placeholder="Nombre de usuario"
          />
          <input
            type="password"
            value={claveRegistro}
            onChange={(e) => setClaveRegistro(e.target.value)}
            placeholder="Contraseña"
          />
          <button type="button" onClick={registrar}>
            Registrar
          </button>
        </form>
      )}
    </div>
  );
};

export default Registro;