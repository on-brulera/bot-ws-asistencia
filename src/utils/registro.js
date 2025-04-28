const { format } = require('date-fns')
const { es } = require('date-fns/locale')


const registroAsistencia = new Map(); // clave: jid, valor: { fecha: 'YYYY-MM-DD', entrada: true, salida: true }

const obtenerFechaActual = () => new Date().toISOString().split('T')[0];

/**
 * Verifica si un usuario puede registrar entrada o salida.
 * Si puede, actualiza el registro y retorna true.
 * Si ya ha registrado, retorna false.
 */
const puedeRegistrar = (jid, tipo) => {
    const hoy = obtenerFechaActual();

    if (!registroAsistencia.has(jid)) {
        registroAsistencia.set(jid, { fecha: hoy, entrada: false, salida: false});
    }

    const registro = registroAsistencia.get(jid);

    // Si es un nuevo día, reinicia las banderas
    if (registro.fecha !== hoy) {
        registro.fecha = hoy;
        registro.entrada = false;
        registro.salida = false;
    }

    if (tipo === 'Entrada' && !registro.entrada) {
        registro.entrada = true;
        return true;
    }

    if (tipo === 'Salida' && !registro.salida) {
        registro.salida = true;
        return true;
    }

    return false;
};

function obtenerResumenDiarioEntrada() {
    const entradas = Object.entries(registroAsistencia)
        .filter(([jid, registro]) => registro.entrada) // Solo mostrar los que hayan registrado entrada
        .map(([jid, registro]) => `🟢 Entrada - ${registro.nombre || jid} a las ${registro.hora || 'hora no registrada'}`)
        .join('\n');

    return `${entradas}`;
}

function obtenerResumenDiarioSalida() {
    const salidas = Object.entries(registroAsistencia)
        .filter(([jid, registro]) => registro.salida) // Solo mostrar los que hayan registrado salida
        .map(([jid, registro]) => `🔴 Salida - ${registro.nombre || jid} a las ${registro.hora || 'hora no registrada'}`)
        .join('\n');

    return `${salidas}`;
}



module.exports = {
    puedeRegistrar,
    obtenerResumenDiarioEntrada,
    obtenerResumenDiarioSalida,
};
