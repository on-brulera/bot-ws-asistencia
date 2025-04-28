const estaEnHorario = (inicioStr, finStr) => {
    const now = new Date();
    const minutosActuales = now.getHours() * 60 + now.getMinutes();
    const inicio = convertirAHoraEnMinutos(inicioStr);
    const fin = convertirAHoraEnMinutos(finStr);
    return minutosActuales >= inicio && minutosActuales <= fin;
};

const verificarHorarioEntrada = () =>
    estaEnHorario(process.env.ENTRADA_INICIO, process.env.ENTRADA_FIN);

const verificarHorarioSalida = () =>{
    return estaEnHorario(process.env.SALIDA_SEMANA_INICIO, process.env.SALIDA_SEMANA_FIN) || estaEnHorario(process.env.SALIDA_FIN_SEMANA_INICIO, process.env.SALIDA_FIN_SEMANA_FIN);
}    

const verificarEstadoEntrada = () => {
    const now = new Date();
    const minutosActuales = now.getHours() * 60 + now.getMinutes();

    const temprano = convertirAHoraEnMinutos(process.env.ENTRADA_TEMPRANO);
    const puntual = convertirAHoraEnMinutos(process.env.ENTRADA_PUNTUAL);

    if (minutosActuales < temprano) return "TEMPRANO";
    if (minutosActuales <= puntual) return "PUNTUAL";
    return "TARDE";
};

const verificarEstadoSalida = () => {
    const now = new Date();
    const dia = now.getDay(); // 0 = Domingo, 6 = Sábado
    const minutosActuales = now.getHours() * 60 + now.getMinutes();

    const limite = dia >= 1 && dia <= 5
        ? convertirAHoraEnMinutos(process.env.SALIDA_LIMITE_SEMANA)
        : convertirAHoraEnMinutos(process.env.SALIDA_LIMITE_FIN_SEMANA);

    return minutosActuales < limite ? "PUNTUAL" : "COMPROMETIDO";
};

const verificarHoraAtencionDelBot = () => {
    const hoy = new Date();
    const dia = hoy.getDay(); // 0 = Domingo, 6 = Sábado

    const horarioManana = estaEnHorario(process.env.ENTRADA_INICIO, process.env.ENTRADA_FIN);

    if (dia >= 1 && dia <= 5) {
        const horarioTarde = estaEnHorario(process.env.SALIDA_SEMANA_INICIO, process.env.SALIDA_SEMANA_FIN);
        return horarioManana || horarioTarde;
    } else {
        const horarioMedioDia = estaEnHorario(process.env.SALIDA_FIN_SEMANA_INICIO, process.env.SALIDA_FIN_SEMANA_FIN);
        return horarioManana || horarioMedioDia;
    }
};

const convertirAHoraEnMinutos = (horaStr) => {
    const [hora, minuto] = horaStr.split(":").map(Number);
    return hora * 60 + minuto;
};

module.exports = {
    verificarHorarioEntrada,
    verificarHorarioSalida,
    verificarHoraAtencionDelBot,
    verificarEstadoEntrada,
    verificarEstadoSalida,
};
