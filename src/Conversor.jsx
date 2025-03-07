import { useState } from 'react';

function Conversor() {
    const [textoAVoz, setTextoAVoz] = useState('');
    const [vozATexto, setVozATexto] = useState('');
    const [grabando, setGrabando] = useState(false);

    function cambiarTexto(evento) {
        setTextoAVoz(evento.target.value);
    }

    function convertirTextoAVoz() {
        if ('speechSynthesis' in window) {
            const synth = window.speechSynthesis;
            const utterThis = new SpeechSynthesisUtterance(textoAVoz);
            synth.speak(utterThis);
        } else {
            alert('Tu navegador no soporta la síntesis de voz.');
        }
    }

    function grabarVozATexto() {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Tu navegador no soporta la conversión de voz a texto.');
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = 'es-ES';
        recognition.continuous = false; // Cambiar a 'true' si quieres que siga escuchando hasta que el usuario lo detenga
        recognition.interimResults = false; // Cambiar a 'true' si quieres obtener resultados parciales

        recognition.onstart = () => {
            console.log('🎤 Grabando...');
            setGrabando(true);
        };

        recognition.onerror = (event) => {
            console.error('❌ Error en reconocimiento:', event.error);
            alert('Error en reconocimiento de voz: ' + event.error);
            setGrabando(false);
        };

        recognition.onend = () => {
            console.log('🛑 Grabación finalizada.');
            setGrabando(false);
        };

        recognition.onresult = (event) => {
            const resultadoFinal = event.results[0][0].transcript;
            console.log('✅ Texto detectado:', resultadoFinal);
            setVozATexto(resultadoFinal);
        };

        recognition.start();
    }

    return (
        <>
            <h1>Conversor TTS y STT</h1>
            <br />
            <h3>Conversor de texto a voz</h3>
            <input type="text" value={textoAVoz} onChange={cambiarTexto} />
            <button onClick={convertirTextoAVoz}>Convertir</button>

            <h3>Conversor de voz a texto</h3>
            <button onClick={grabarVozATexto} disabled={grabando}>
                {grabando ? 'Grabando...' : 'Grabar'}
            </button>
            <p><strong>Texto detectado:</strong> {vozATexto}</p>
        </>
    );
}

{logueado && (
    <button style={{ position: "absolute", top: 10, right: 10 }} onClick={cerrarSesion}>
        Cerrar Sesión
    </button>
)}

export default Conversor;