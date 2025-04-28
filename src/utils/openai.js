const axios = require('axios');
require('dotenv').config(); 



const enviarAOpenAI = async (mensaje) => {
    try {
        // Obtener la clave de la API desde el archivo .env
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            throw new Error("No se encontró una clave API válida en el archivo .env.");
        }

        const url = "https://api.openai.com/v1/chat/completions";

        // Datos a enviar a la API
        const data = {
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "Eres el gerente de una institucion financiera, das frases de motivacion diferentes sin especificar el sexo del personal que ingresa y cierra la institucion con un minimo de 19 máximo de 27 palabras."
                },
                {
                    role: "user",
                    content: mensaje
                }
            ],
            temperature: 0.7
        };

        // Configuración de las cabeceras
        const headers = {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        };

        // Enviar la solicitud
        const response = await axios.post(url, data, { headers });

        // Verificar si la respuesta fue exitosa
        if (response.status === 200) {
            const respuesta = response.data.choices[0]?.message?.content;
            return respuesta ? respuesta.trim() : "No se recibió respuesta de la IA.";
        } else {
            // Manejar errores de la API
            return `Error en la API de OpenAI: ${response.status} - ${response.statusText}`;
        }
    } catch (error) {
        // Manejar errores generales
        return `Error al comunicarse con la API de OpenAI: ${error.message}`;
    }
};


const obtenerMensajeTemprano = async () => {
    const mensaje = "Genera un mensaje motivacional para alguien que ha llegado temprano a abrir la institución, felicitándolo por su compromiso y dándole motivación.";
    try {
        const respuesta = await enviarAOpenAI(mensaje);        
        if (!respuesta || respuesta.trim() === '') {
            return '¡Buenos días! Gracias por tu compromiso al llegar temprano. Estamos listos para comenzar el día con energía positiva. ¡A seguir adelante!';
        }
        return respuesta;
    } catch (error) {
        console.error('Error al obtener mensaje temprano desde ChatGPT:', error);
        return '¡Buenos días! Gracias por tu compromiso al llegar temprano. Estamos listos para comenzar el día con energía positiva. ¡A seguir adelante!';
    }
};


const obtenerMensajePuntual = async () => {
    const mensaje = "Genera un mensaje deseando un buen día a alguien que ha llegado puntualmente a la institución, agradeciendo su puntualidad.";
    try {
        const respuesta = await enviarAOpenAI(mensaje);
        if (!respuesta || respuesta.trim() === '') {
            return '¡Buenos días! Gracias por llegar puntualmente. Tu esfuerzo y compromiso marcan la diferencia. ¡Vamos a tener un gran día!';
        }
        return respuesta;
    } catch (error) {
        console.error('Error al obtener mensaje puntual desde ChatGPT:', error);
        return '¡Buenos días! Gracias por llegar puntualmente. Tu esfuerzo y compromiso marcan la diferencia. ¡Vamos a tener un gran día!';
    }
};

const obtenerMensajeTarde = async () => {
    const mensaje = "Genera un mensaje de llamada de atención para alguien que ha llegado tarde, que no vuelva a suceder y que tenga un buen día.";
    try {
        const respuesta = await enviarAOpenAI(mensaje);        
        if (!respuesta || respuesta.trim() === '') {
            return 'Has llegado tarde hoy. Recuerda que la puntualidad es importante para el buen funcionamiento de la institución. ¡Que tengas un buen día!';
        }
        return respuesta; 
    } catch (error) {
        console.error('Error al obtener mensaje de tardanza desde ChatGPT:', error);
        return 'Has llegado tarde hoy. Recuerda que la puntualidad es importante para el buen funcionamiento de la institución. ¡Que tengas un buen día!';
    }
};

const obtenerMensajeSalidaTarde = async () => {
    const mensaje = "Genera un mensaje para quien ha salido tarde, dándole gracias por su compromiso y deseándole descansar bien.";
    try {
        const respuesta = await enviarAOpenAI(mensaje);
        if (!respuesta || respuesta.trim() === '') {
            return 'Gracias por tu esfuerzo hoy. Sabemos que has dado lo mejor de ti. ¡Que tengas un descanso reparador!';
        }
        return respuesta; 
    } catch (error) {
        console.error('Error al obtener mensaje de salida tarde desde ChatGPT:', error);
        return 'Gracias por tu esfuerzo hoy. Sabemos que has dado lo mejor de ti. ¡Que tengas un descanso reparador!';
    }
};

const obtenerMensajeSalidaNormal = async () => {
    const mensaje = "Genera un mensaje para quien ha salido, deseándole descansar bien.";
    try {
        const respuesta = await enviarAOpenAI(mensaje);
        if (!respuesta || respuesta.trim() === '') {
            return 'Gracias por tu dedicación hoy. Que tengas un merecido descanso. ¡Nos vemos mañana!';
        }
        return respuesta;
    } catch (error) {
        console.error('Error al obtener mensaje de salida normal desde ChatGPT:', error);
        return 'Gracias por tu dedicación hoy. Que tengas un merecido descanso. ¡Nos vemos mañana!';
    }
};


module.exports = { enviarAOpenAI, obtenerMensajeTemprano, obtenerMensajePuntual, obtenerMensajeTarde, obtenerMensajeSalidaTarde, obtenerMensajeSalidaNormal };
