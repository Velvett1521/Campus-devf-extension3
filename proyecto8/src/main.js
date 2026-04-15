import {
  iniciar_nuevo_juego,
  verificar_intento,
  cambiar_dificultad,
  obtener_historial,
  obtener_estadisticas
} from './modules/juego.js';

import {
  actualizar_ui_estadisticas,
  actualizar_ui_mensaje,
  actualizar_ui_historial,
  limpiar_input,
  mostrar_error_input,
  mostrar_modal_dificultad,
  cerrar_modal,
  habilitar_boton_adivinar
} from './modules/ui.js';

let juego_activo = true;

function inicializar_juego() {
  const datos_juego = iniciar_nuevo_juego();
  actualizar_ui_estadisticas(0, 0, datos_juego.limite_inferior, datos_juego.limite_superior);
  actualizar_ui_mensaje('Adivina el numero! Ingresa tu primer intento');
  actualizar_ui_historial([]);
  limpiar_input();
  habilitar_boton_adivinar(true);
  juego_activo = true;
}

function manejar_intento() {
  if (!juego_activo) {
    actualizar_ui_mensaje('El juego ha terminado. Inicia uno nuevo');
    return;
  }
  
  const input_el = document.getElementById('input_numero');
  const numero = parseInt(input_el.value);
  
  if (isNaN(numero)) {
    actualizar_ui_mensaje('Ingresa un numero valido');
    mostrar_error_input();
    return;
  }
  
  const resultado = verificar_intento(numero);
  
  if (resultado.exito) {
    actualizar_ui_mensaje(resultado.mensaje);
    
    if (resultado.pista) {
      actualizar_ui_mensaje(resultado.mensaje, `Pista: El numero es mas ${resultado.pista}`);
    }
    
    const stats = obtener_estadisticas();
    actualizar_ui_estadisticas(
      stats.intentos,
      stats.mejor_racha,
      stats.limite_inferior,
      stats.limite_superior
    );
    
    const historial = obtener_historial();
    actualizar_ui_historial(historial);
    limpiar_input();
    
    if (resultado.ganador) {
      juego_activo = false;
      habilitar_boton_adivinar(false);
      actualizar_ui_mensaje(
        `Felicidades! Adivinaste en ${resultado.intentos} intentos. Presiona "Nuevo Juego" para seguir jugando`
      );
    }
  } else {
    actualizar_ui_mensaje(resultado.mensaje);
    mostrar_error_input();
  }
}

function manejar_nuevo_juego() {
  inicializar_juego();
}

function manejar_cambio_dificultad(event) {
  const nivel = event.target.dataset.dificultad;
  if (nivel) {
    const resultado = cambiar_dificultad(nivel);
    if (resultado) {
      actualizar_ui_mensaje(resultado.mensaje);
      const stats = obtener_estadisticas();
      actualizar_ui_estadisticas(
        stats.intentos,
        stats.mejor_racha,
        resultado.min,
        resultado.max
      );
      actualizar_ui_historial([]);
      limpiar_input();
      juego_activo = true;
      habilitar_boton_adivinar(true);
      cerrar_modal();
    }
  }
}

function configurar_eventos() {
  const btn_adivinar = document.getElementById('btn_adivinar');
  const btn_nuevo_juego = document.getElementById('btn_nuevo_juego');
  const btn_dificultad = document.getElementById('btn_dificultad');
  const modal_close = document.querySelector('.modal-close');
  const modal = document.getElementById('modal_dificultad');
  const input_numero = document.getElementById('input_numero');
  
  if (btn_adivinar) btn_adivinar.addEventListener('click', manejar_intento);
  if (btn_nuevo_juego) btn_nuevo_juego.addEventListener('click', manejar_nuevo_juego);
  if (btn_dificultad) btn_dificultad.addEventListener('click', mostrar_modal_dificultad);
  if (modal_close) modal_close.addEventListener('click', cerrar_modal);
  
  if (input_numero) {
    input_numero.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') manejar_intento();
    });
  }
  
  window.addEventListener('click', (e) => {
    if (e.target === modal) cerrar_modal();
  });
  
  const dificultad_btns = document.querySelectorAll('.dificultad-btn');
  dificultad_btns.forEach(btn => {
    btn.addEventListener('click', manejar_cambio_dificultad);
  });
}

inicializar_juego();
configurar_eventos();