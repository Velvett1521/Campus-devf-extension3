function actualizar_ui_estadisticas(intentos, mejor_racha, min, max) {
  const intentos_el = document.getElementById('intentos');
  const mejor_racha_el = document.getElementById('mejor_racha');
  const rango_el = document.getElementById('rango');
  
  if (intentos_el) intentos_el.textContent = intentos;
  if (mejor_racha_el) mejor_racha_el.textContent = mejor_racha;
  if (rango_el) rango_el.textContent = `${min} - ${max}`;
}

function actualizar_ui_mensaje(mensaje, pista = '') {
  const mensaje_el = document.getElementById('mensaje');
  const pista_el = document.getElementById('pista');
  
  if (mensaje_el) mensaje_el.textContent = mensaje;
  if (pista_el) pista_el.textContent = pista;
}

function actualizar_ui_historial(historial) {
  const lista_el = document.getElementById('historial_lista');
  
  if (!lista_el) return;
  
  if (historial.length === 0) {
    lista_el.innerHTML = '<li style="text-align: center; color: #999;">No hay intentos aun</li>';
    return;
  }
  
  lista_el.innerHTML = historial.map(item => {
    let clase = '';
    let texto_pista = '';
    
    if (item.tipo === 'alto') {
      clase = 'historial-alto';
      texto_pista = '⬆ Muy alto';
    } else if (item.tipo === 'bajo') {
      clase = 'historial-bajo';
      texto_pista = '⬇ Muy bajo';
    } else {
      clase = 'historial-exito';
      texto_pista = '🎉 Exito!';
    }
    
    return `
      <li>
        <span>Numero: ${item.numero}</span>
        <span class="${clase}">${texto_pista}</span>
        <span style="color: #999; font-size: 0.7em;">${item.timestamp}</span>
      </li>
    `;
  }).join('');
}

function limpiar_input() {
  const input_el = document.getElementById('input_numero');
  if (input_el) {
    input_el.value = '';
    input_el.focus();
  }
}

function mostrar_error_input() {
  const input_el = document.getElementById('input_numero');
  if (input_el) {
    input_el.classList.add('error-shake');
    setTimeout(() => {
      input_el.classList.remove('error-shake');
    }, 300);
  }
}

function mostrar_modal_dificultad() {
  const modal = document.getElementById('modal_dificultad');
  if (modal) modal.style.display = 'block';
}

function cerrar_modal() {
  const modal = document.getElementById('modal_dificultad');
  if (modal) modal.style.display = 'none';
}

function habilitar_boton_adivinar(habilitado) {
  const btn = document.getElementById('btn_adivinar');
  if (btn) btn.disabled = !habilitado;
}

export {
  actualizar_ui_estadisticas,
  actualizar_ui_mensaje,
  actualizar_ui_historial,
  limpiar_input,
  mostrar_error_input,
  mostrar_modal_dificultad,
  cerrar_modal,
  habilitar_boton_adivinar
};