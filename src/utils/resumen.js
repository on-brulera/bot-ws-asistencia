const cron = require('node-cron');
const { obtenerResumenDiarioEntrada, obtenerResumenDiarioSalida } = require('./registro');

async function configurarEnvioResumenEntrada(provider) {
    //const instance = await provider.getInstance();
    const jidDueno = provider.user.id;

    cron.schedule('21 8 * * 1-5', async () => {
        const resumen = obtenerResumenDiarioEntrada();
        if (resumen && resumen.trim() !== '') {
            await provider.sendText(jidDueno, `📋 *Resumen diario de asistencia:*\n\n${resumen}`);
        }
    });
}

async function configurarEnvioResumenSalida(provider) {
    const instance = await provider.getInstance();
    const jidDueno = instance.user.id;

    cron.schedule('21 18 * * 1-5', async () => {
        const resumen = obtenerResumenDiarioSalida();
        if (resumen && resumen.trim() !== '') {
            await provider.sendText(jidDueno, `📋 *Resumen diario de asistencia:*\n\n${resumen}`);
        }
    });
}

module.exports = { configurarEnvioResumenEntrada, configurarEnvioResumenSalida };
