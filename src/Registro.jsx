import React, { useState, useEffect } from "react";

const Registro = () => {
  const [usuarioRegistro, setUsuarioRegistro] = useState('');
  const [claveRegistro, setClaveRegistro] = useState('');
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const [usuarios, setUsuarios] = useState([]);

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
        obtenerUsuarios();  // Actualizar la lista de usuarios después del registro
      } else {
        alert('Error al registrar el usuario');
      }
    } catch (error) {
      console.error('Error en el registro:', error);
    }
  };

  // Obtener la lista de usuarios
  const obtenerUsuarios = async () => {
    try {
      const response = await fetch('https://loginexpress-1-8pdh.onrender.com/usuarios', {
        method: 'GET',
        credentials: 'include', // Enviar cookies si las hay
      });
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      } else {
        console.log('No se pudo obtener la lista de usuarios');
      }
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
    }
  };

  // Solo mostrar la lista de usuarios si el usuario es un administrador
  const mostrarUsuariosParaAdmin = () => {
    return (
      <div>
        <h3>Lista de Usuarios</h3>
        <ul>
          {usuarios.map((usuario, index) => (
            <li key={index}>{usuario.usuario}</li>
          ))}
        </ul>
      </div>
    );
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
      {registroExitoso && mostrarUsuariosParaAdmin()}
    </div>
  );
};

export default Registro;