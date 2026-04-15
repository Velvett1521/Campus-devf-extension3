const fecha_minima = new Date();
fecha_minima.setDate(fecha_minima.getDate() + 1);
fecha_minima.setHours(0, 0, 0, 0);

const fecha_maxima = new Date();
fecha_maxima.setMonth(fecha_maxima.getMonth() + 3);

const input_fecha = document.getElementById('fecha_evento');
if (input_fecha) {
    input_fecha.min = fecha_minima.toISOString().split('T')[0];
    input_fecha.max = fecha_maxima.toISOString().split('T')[0];
}

function validar_nombre(nombre) {
    if (!nombre || nombre.trim() === '') {
        return { valido: false, mensaje: 'El nombre es obligatorio' };
    }
    
    if (nombre.trim().length < 3) {
        return { valido: false, mensaje: 'El nombre debe tener al menos 3 caracteres' };
    }
    
    if (nombre.trim().length > 80) {
        return { valido: false, mensaje: 'El nombre no puede exceder 80 caracteres' };
    }
    
    const regex_nombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!regex_nombre.test(nombre.trim())) {
        return { valido: false, mensaje: 'El nombre solo puede contener letras y espacios' };
    }
    
    const palabras = nombre.trim().split(/\s+/);
    if (palabras.length < 2) {
        return { valido: false, mensaje: 'Ingrese nombre y apellido completo' };
    }
    
    return { valido: true, mensaje: '' };
}

function validar_email(email) {
    if (!email || email.trim() === '') {
        return { valido: false, mensaje: 'El correo electronico es obligatorio' };
    }
    
    const regex_email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex_email.test(email.trim())) {
        return { valido: false, mensaje: 'Ingrese un correo electronico valido (ejemplo@dominio.com)' };
    }
    
    if (email.trim().length > 100) {
        return { valido: false, mensaje: 'El correo no puede exceder 100 caracteres' };
    }
    
    const dominios_permitidos = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com'];
    const dominio = email.trim().split('@')[1];
    if (!dominios_permitidos.includes(dominio)) {
        return { valido: false, mensaje: 'Dominio de correo no reconocido, use Gmail, Hotmail, Outlook, Yahoo o iCloud' };
    }
    
    return { valido: true, mensaje: '' };
}

function validar_telefono(telefono) {
    if (!telefono || telefono.trim() === '') {
        return { valido: false, mensaje: 'El telefono es obligatorio' };
    }
    
    const telefono_limpio = telefono.trim().replace(/[\s\-\(\)]/g, '');
    
    const regex_telefono = /^\d{10}$/;
    if (!regex_telefono.test(telefono_limpio)) {
        return { valido: false, mensaje: 'Ingrese un numero de telefono valido de 10 digitos' };
    }
    
    if (telefono_limpio[0] !== '5' && telefono_limpio[0] !== '6' && telefono_limpio[0] !== '7') {
        return { valido: false, mensaje: 'El telefono debe comenzar con 5, 6 o 7' };
    }
    
    return { valido: true, mensaje: '' };
}

function validar_edad(edad) {
    if (!edad) {
        return { valido: false, mensaje: 'La edad es obligatoria' };
    }
    
    const edad_num = parseInt(edad);
    if (isNaN(edad_num)) {
        return { valido: false, mensaje: 'Ingrese una edad valida' };
    }
    
    if (edad_num < 18) {
        return { valido: false, mensaje: 'Debe ser mayor de 18 años para registrarse' };
    }
    
    if (edad_num > 99) {
        return { valido: false, mensaje: 'La edad no puede ser mayor a 99 años' };
    }
    
    return { valido: true, mensaje: '' };
}

function validar_fecha_evento(fecha) {
    if (!fecha) {
        return { valido: false, mensaje: 'La fecha del evento es obligatoria' };
    }
    
    const fecha_seleccionada = new Date(fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    if (fecha_seleccionada < hoy) {
        return { valido: false, mensaje: 'La fecha no puede ser anterior a hoy' };
    }
    
    if (fecha_seleccionada < fecha_minima) {
        return { valido: false, mensaje: 'La reserva debe hacerse con al menos 1 dia de anticipacion' };
    }
    
    if (fecha_seleccionada > fecha_maxima) {
        return { valido: false, mensaje: 'Las reservas solo se aceptan con maximo 3 meses de anticipacion' };
    }
    
    const dia_semana = fecha_seleccionada.getDay();
    if (dia_semana === 0 || dia_semana === 6) {
        return { valido: false, mensaje: 'El evento no se realiza los fines de semana' };
    }
    
    return { valido: true, mensaje: '' };
}

function validar_intereses() {
    const checkboxes = document.querySelectorAll('input[name="intereses"]:checked');
    if (checkboxes.length === 0) {
        return { valido: false, mensaje: 'Seleccione al menos un interes' };
    }
    
    if (checkboxes.length > 3) {
        return { valido: false, mensaje: 'Puede seleccionar maximo 3 intereses' };
    }
    
    return { valido: true, mensaje: '' };
}

function validar_horario() {
    const horario_seleccionado = document.querySelector('input[name="horario"]:checked');
    if (!horario_seleccionado) {
        return { valido: false, mensaje: 'Seleccione un horario preferido' };
    }
    
    return { valido: true, mensaje: '' };
}

function validar_archivo(file_input) {
    if (!file_input.files || file_input.files.length === 0) {
        return { valido: true, mensaje: '' };
    }
    
    const archivo = file_input.files[0];
    const tamanio_maximo = 5 * 1024 * 1024;
    
    if (archivo.size > tamanio_maximo) {
        return { valido: false, mensaje: 'El archivo no puede exceder 5MB' };
    }
    
    const extensiones_permitidas = ['pdf', 'jpg', 'jpeg', 'png'];
    const extension = archivo.name.split('.').pop().toLowerCase();
    
    if (!extensiones_permitidas.includes(extension)) {
        return { valido: false, mensaje: 'Solo se permiten archivos PDF, JPG o PNG' };
    }
    
    return { valido: true, mensaje: '' };
}

function mostrar_error(campo_id, mensaje) {
    const error_span = document.getElementById(`error_${campo_id}`);
    const input_element = document.getElementById(campo_id);
    
    if (error_span) {
        error_span.textContent = mensaje;
    }
    
    if (input_element && mensaje) {
        input_element.classList.add('error');
    } else if (input_element) {
        input_element.classList.remove('error');
    }
}

function limpiar_errores() {
    const errores = document.querySelectorAll('.error-message');
    errores.forEach(error => error.textContent = '');
    
    const inputs_con_error = document.querySelectorAll('.error');
    inputs_con_error.forEach(input => input.classList.remove('error'));
}

function obtener_valores_formulario() {
    const intereses_seleccionados = [];
    document.querySelectorAll('input[name="intereses"]:checked').forEach(cb => {
        intereses_seleccionados.push(cb.value);
    });
    
    const horario_seleccionado = document.querySelector('input[name="horario"]:checked');
    const archivo_input = document.getElementById('identificacion');
    let nombre_archivo = 'No se subio archivo';
    
    if (archivo_input.files && archivo_input.files.length > 0) {
        nombre_archivo = archivo_input.files[0].name;
    }
    
    return {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        edad: document.getElementById('edad').value,
        fecha_evento: document.getElementById('fecha_evento').value,
        intereses: intereses_seleccionados,
        horario: horario_seleccionado ? horario_seleccionado.value : '',
        archivo: nombre_archivo,
        comentarios: document.getElementById('comentarios').value
    };
}

function mostrar_resumen(datos) {
    const resumen_div = document.getElementById('resumen_registro');
    
    const fecha_formateada = datos.fecha_evento ? new Date(datos.fecha_evento).toLocaleDateString('es-ES') : 'No especificada';
    
    const horario_texto = {
        'matutino': 'Matutino (9:00 - 13:00)',
        'vespertino': 'Vespertino (14:00 - 18:00)',
        'completo': 'Completo (9:00 - 18:00)'
    };
    
    resumen_div.innerHTML = `
        <div class="resumen-item"><strong>Nombre:</strong> ${datos.nombre}</div>
        <div class="resumen-item"><strong>Email:</strong> ${datos.email}</div>
        <div class="resumen-item"><strong>Telefono:</strong> ${datos.telefono}</div>
        <div class="resumen-item"><strong>Edad:</strong> ${datos.edad} años</div>
        <div class="resumen-item"><strong>Fecha Evento:</strong> ${fecha_formateada}</div>
        <div class="resumen-item"><strong>Intereses:</strong> ${datos.intereses.join(', ') || 'Ninguno'}</div>
        <div class="resumen-item"><strong>Horario:</strong> ${horario_texto[datos.horario] || datos.horario}</div>
        <div class="resumen-item"><strong>Archivo:</strong> ${datos.archivo}</div>
        <div class="resumen-item"><strong>Comentarios:</strong> ${datos.comentarios || 'Sin comentarios'}</div>
    `;
}

function limpiar_formulario() {
    document.getElementById('form_registro').reset();
    limpiar_errores();
    
    const archivo_input = document.getElementById('identificacion');
    if (archivo_input) {
        archivo_input.value = '';
    }
}

function mostrar_modal() {
    const modal = document.getElementById('modal_exito');
    modal.style.display = 'block';
}

function cerrar_modal() {
    const modal = document.getElementById('modal_exito');
    modal.style.display = 'none';
}

document.getElementById('form_registro').addEventListener('submit', (e) => {
    e.preventDefault();
    limpiar_errores();
    
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;
    const edad = document.getElementById('edad').value;
    const fecha_evento = document.getElementById('fecha_evento').value;
    const archivo_input = document.getElementById('identificacion');
    
    const validacion_nombre = validar_nombre(nombre);
    const validacion_email = validar_email(email);
    const validacion_telefono = validar_telefono(telefono);
    const validacion_edad = validar_edad(edad);
    const validacion_fecha = validar_fecha_evento(fecha_evento);
    const validacion_intereses = validar_intereses();
    const validacion_horario = validar_horario();
    const validacion_archivo = validar_archivo(archivo_input);
    
    mostrar_error('nombre', validacion_nombre.valido ? '' : validacion_nombre.mensaje);
    mostrar_error('email', validacion_email.valido ? '' : validacion_email.mensaje);
    mostrar_error('telefono', validacion_telefono.valido ? '' : validacion_telefono.mensaje);
    mostrar_error('edad', validacion_edad.valido ? '' : validacion_edad.mensaje);
    mostrar_error('fecha', validacion_fecha.valido ? '' : validacion_fecha.mensaje);
    mostrar_error('intereses', validacion_intereses.valido ? '' : validacion_intereses.mensaje);
    mostrar_error('horario', validacion_horario.valido ? '' : validacion_horario.mensaje);
    mostrar_error('archivo', validacion_archivo.valido ? '' : validacion_archivo.mensaje);
    
    const es_valido = validacion_nombre.valido &&
                      validacion_email.valido &&
                      validacion_telefono.valido &&
                      validacion_edad.valido &&
                      validacion_fecha.valido &&
                      validacion_intereses.valido &&
                      validacion_horario.valido &&
                      validacion_archivo.valido;
    
    if (es_valido) {
        const datos = obtener_valores_formulario();
        mostrar_resumen(datos);
        mostrar_modal();
        console.log('Formulario enviado:', datos);
    } else {
        const primer_error = document.querySelector('.error-message:not(:empty)');
        if (primer_error) {
            primer_error.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
});

document.getElementById('btn_limpiar').addEventListener('click', () => {
    if (confirm('Esta seguro de limpiar todos los campos del formulario?')) {
        limpiar_formulario();
    }
});

document.querySelector('.modal-close').addEventListener('click', cerrar_modal);
document.getElementById('modal_cerrar').addEventListener('click', () => {
    cerrar_modal();
    limpiar_formulario();
});

window.addEventListener('click', (e) => {
    const modal = document.getElementById('modal_exito');
    if (e.target === modal) {
        cerrar_modal();
    }
});

document.getElementById('nombre').addEventListener('input', (e) => {
    const validacion = validar_nombre(e.target.value);
    mostrar_error('nombre', validacion.valido ? '' : validacion.mensaje);
});

document.getElementById('email').addEventListener('input', (e) => {
    const validacion = validar_email(e.target.value);
    mostrar_error('email', validacion.valido ? '' : validacion.mensaje);
});

document.getElementById('telefono').addEventListener('input', (e) => {
    const validacion = validar_telefono(e.target.value);
    mostrar_error('telefono', validacion.valido ? '' : validacion.mensaje);
});

document.getElementById('edad').addEventListener('input', (e) => {
    const validacion = validar_edad(e.target.value);
    mostrar_error('edad', validacion.valido ? '' : validacion.mensaje);
});

document.getElementById('fecha_evento').addEventListener('change', (e) => {
    const validacion = validar_fecha_evento(e.target.value);
    mostrar_error('fecha', validacion.valido ? '' : validacion.mensaje);
});

document.querySelectorAll('input[name="intereses"]').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        const validacion = validar_intereses();
        mostrar_error('intereses', validacion.valido ? '' : validacion.mensaje);
    });
});

document.querySelectorAll('input[name="horario"]').forEach(radio => {
    radio.addEventListener('change', () => {
        const validacion = validar_horario();
        mostrar_error('horario', validacion.valido ? '' : validacion.mensaje);
    });
});

document.getElementById('identificacion').addEventListener('change', (e) => {
    const validacion = validar_archivo(e.target);
    mostrar_error('archivo', validacion.valido ? '' : validacion.mensaje);
});