let numero_secreto = null;
let intentos = 0;
let mejor_racha = 0;
let racha_actual = 0;
let limite_inferior = 1;
let limite_superior = 100;
let historial = [];

function generar_numero_aleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function iniciar_nuevo_juego() {
  numero_secreto = generar_numero_aleatorio(limite_inferior, limite_superior);
  intentos = 0;
  racha_actual = 0;
  historial = [];
  console.log(`Nuevo juego. Numero secreto: ${numero_secreto}`);
  return {
    numero_secreto: numero_secreto,
    limite_inferior: limite_inferior,
    limite_superior: limite_superior
  };
}

function verificar_intento(numero_usuario) {
  if (numero_secreto === null) {
    return { exito: false, mensaje: 'Inicia un nuevo juego primero' };
  }
  
  if (isNaN(numero_usuario)) {
    return { exito: false, mensaje: 'Ingresa un numero valido' };
  }
  
  if (numero_usuario < limite_inferior || numero_usuario > limite_superior) {
    return { 
      exito: false, 
      mensaje: `El numero debe estar entre ${limite_inferior} y ${limite_superior}` 
    };
  }
  
  intentos++;
  
  let resultado = {};
  let tipo_intento = '';
  
  if (numero_usuario === numero_secreto) {
    racha_actual++;
    if (racha_actual > mejor_racha) {
      mejor_racha = racha_actual;
    }
    resultado = {
      exito: true,
      mensaje: `Felicidades! Adivinaste en ${intentos} intentos`,
      ganador: true,
      intentos: intentos
    };
    tipo_intento = 'exito';
  } else if (numero_usuario > numero_secreto) {
    resultado = {
      exito: true,
      mensaje: 'Muy alto! Sigue intentando',
      ganador: false,
      pista: 'bajo',
      intentos: intentos
    };
    tipo_intento = 'alto';
  } else {
    resultado = {
      exito: true,
      mensaje: 'Muy bajo! Sigue intentando',
      ganador: false,
      pista: 'alto',
      intentos: intentos
    };
    tipo_intento = 'bajo';
  }
  
  historial.push({
    numero: numero_usuario,
    tipo: tipo_intento,
    timestamp: new Date().toLocaleTimeString()
  });
  
  return resultado;
}

function cambiar_dificultad(nivel) {
  const dificultades = {
    facil: { min: 1, max: 50 },
    normal: { min: 1, max: 100 },
    dificil: { min: 1, max: 200 },
    experto: { min: 1, max: 500 }
  };
  
  const config = dificultades[nivel];
  if (config) {
    limite_inferior = config.min;
    limite_superior = config.max;
    iniciar_nuevo_juego();
    return {
      min: limite_inferior,
      max: limite_superior,
      mensaje: `Dificultad cambiada a ${nivel} (${limite_inferior}-${limite_superior})`
    };
  }
  
  return null;
}

function obtener_historial() {
  return [...historial];
}

function reiniciar_racha() {
  racha_actual = 0;
}

function obtener_estadisticas() {
  return {
    intentos: intentos,
    mejor_racha: mejor_racha,
    limite_inferior: limite_inferior,
    limite_superior: limite_superior,
    numero_secreto: numero_secreto
  };
}

export {
  iniciar_nuevo_juego,
  verificar_intento,
  cambiar_dificultad,
  obtener_historial,
  obtener_estadisticas,
  reiniciar_racha
};