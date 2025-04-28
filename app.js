require('dotenv').config();

const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')
const { EVENTS } = require('@bot-whatsapp/bot')
const { verificarHorarioEntrada, verificarHorarioSalida, verificarHoraAtencionDelBot, verificarEstadoEntrada, verificarEstadoSalida } = require('./src/utils/horario')
const { simularEscrituraHumana } = require('./src/utils/simulacionEscrituraBot')
const { obtenerMensajeTemprano, obtenerMensajePuntual, obtenerMensajeTarde, obtenerMensajeSalidaTarde, obtenerMensajeSalidaNormal } = require('./src/utils/openai');
const { puedeRegistrar } = require('./src/utils/registro')
const { configurarEnvioResumenEntrada, configurarEnvioResumenSalida } = require('./src/utils/resumen')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

const ultimosMedios = new Map() // clave: jid, valor: timestamp en ms

const flujoAsistencia = addKeyword(EVENTS.MEDIA)
    .addAction(async (ctx, { flowDynamic, provider }) => {
        //Verificar si el bot esta activo
        const elBotEstaActivo = verificarHoraAtencionDelBot();        
        if (!elBotEstaActivo) return;

        const jid = ctx.key.remoteJid
        const messageId = ctx.key.id
        const ahora = Date.now()

        // Tiempo de espera mínimo entre respuestas por el mismo usuario (10 segundos)
        const tiempoMinimo = 10 * 1000
        if (ultimosMedios.has(jid) && (ahora - ultimosMedios.get(jid)) < tiempoMinimo) {
            await provider.vendor.readMessages([{ remoteJid: jid, id: messageId }]);
            return;
        }
        ultimosMedios.set(jid, ahora)

        const esHoraDeEntrada = verificarHorarioEntrada();        
        if (esHoraDeEntrada && puedeRegistrar(jid, 'Entrada')) {            
            await simularEscrituraHumana(provider, jid, messageId);
            const estadoEntrada = verificarEstadoEntrada();
            if (estadoEntrada == "TEMPRANO") await flowDynamic(await obtenerMensajeTemprano());                
            if (estadoEntrada == "PUNTUAL") await flowDynamic(await obtenerMensajePuntual());
            if (estadoEntrada == "TARDE") await flowDynamic(await obtenerMensajeTarde());
        }

        const esHoraDeSalida = verificarHorarioSalida();
        if (esHoraDeSalida && puedeRegistrar(jid, 'Salida')) {
            await simularEscrituraHumana(provider, jid, messageId);
            const estadoSalida = verificarEstadoSalida();
            if (estadoSalida == 'PUNTUAL') await flowDynamic(await obtenerMensajeSalidaNormal());
            if (estadoSalida == 'COMPROMETIDO') await flowDynamic(await obtenerMensajeSalidaTarde());
        }

    })

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flujoAsistencia])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    //configurarEnvioResumenEntrada(adapterProvider)
    //configurarEnvioResumenSalida(adapterProvider)

    QRPortalWeb()
}

main()
