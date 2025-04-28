const simularEscrituraHumana = async (provider, jid, messageId) => {
    const tiempoEspera = Math.floor(Math.random() * (30000 - 15000 + 1)) + 15000;
    // Espera 3 segundos antes de marcar el visto
    await new Promise(resolve => setTimeout(resolve, tiempoEspera));
    await provider.vendor.readMessages([{ remoteJid: jid, id: messageId }]);

    // Descansa 2 segundos
    await new Promise(resolve => setTimeout(resolve, 3100));

    // Simula que está escribiendo
    await provider.vendor.sendPresenceUpdate('composing', jid);
    await new Promise(resolve => setTimeout(resolve, 3500));

    // Pausa escritura
    await provider.vendor.sendPresenceUpdate('paused', jid);
    await new Promise(resolve => setTimeout(resolve, 2300))

    // Simular que escribo el mensaje por N segundos
    await provider.vendor.sendPresenceUpdate('composing', jid)
    await new Promise(resolve => setTimeout(resolve, 4000))
    await provider.vendor.sendPresenceUpdate('paused', jid);
};

module.exports = { simularEscrituraHumana };