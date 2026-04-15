let mesas_totales = 10;
let mesas_ocupadas = 0;
let reservas = [];
let contador_reserva_id = 1;

function mostrar_mensaje(mensaje, es_error = false) {
    const mensaje_div = document.getElementById('mensaje');
    mensaje_div.textContent = mensaje;
    mensaje_div.style.backgroundColor = es_error ? '#d63031' : '#00b894';
    mensaje_div.style.display = 'block';
    
    setTimeout(() => {
        mensaje_div.style.display = 'none';
    }, 3000);
}

function actualizar_interfaz_mesas() {
    const mesas_disponibles = mesas_totales - mesas_ocupadas;
    document.getElementById('mesas_disponibles').textContent = mesas_disponibles;
}

function renderizar_reservas() {
    const lista_reservas_div = document.getElementById('lista_reservas');
    
    if (reservas.length === 0) {
        lista_reservas_div.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #999;">
                No hay reservas realizadas
            </div>
        `;
        return;
    }
    
    lista_reservas_div.innerHTML = reservas.map(reserva => {
        let estado_class = '';
        if (reserva.estado === 'exitosa') {
            estado_class = 'estado-exitosa';
        } else if (reserva.estado === 'fallida') {
            estado_class = 'estado-fallida';
        } else {
            estado_class = 'estado-pendiente';
        }
        
        return `
            <div class="reserva-item">
                <div class="reserva-cliente">${reserva.nombre_cliente}</div>
                <div class="reserva-detalle">
                    <strong>ID:</strong> ${reserva.id} | 
                    <strong>Mesas:</strong> ${reserva.mesas_solicitadas} | 
                    <strong>Fecha:</strong> ${new Date(reserva.timestamp).toLocaleString()}
                </div>
                <div class="reserva-estado ${estado_class}">
                    ${reserva.estado.toUpperCase()} ${reserva.mensaje ? `- ${reserva.mensaje}` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function verificar_disponibilidad(mesas_solicitadas) {
    return new Promise((resolve, reject) => {
        console.log(`Verificando disponibilidad para ${mesas_solicitadas} mesa(s)`);
        
        setTimeout(() => {
            const mesas_disponibles = mesas_totales - mesas_ocupadas;
            
            if (mesas_solicitadas <= 0) {
                reject(new Error('El numero de mesas debe ser mayor a 0'));
                return;
            }
            
            if (mesas_solicitadas > 5) {
                reject(new Error('Maximo 5 mesas por reserva'));
                return;
            }
            
            if (mesas_solicitadas <= mesas_disponibles) {
                console.log(`Disponibilidad confirmada: ${mesas_disponibles} mesas disponibles`);
                resolve({
                    exito: true,
                    mesas_disponibles: mesas_disponibles,
                    mesas_solicitadas: mesas_solicitadas
                });
            } else {
                console.log(`No hay suficientes mesas. Disponibles: ${mesas_disponibles}, Solicitadas: ${mesas_solicitadas}`);
                reject(new Error(`No hay suficientes mesas disponibles. Solo quedan ${mesas_disponibles} mesa(s)`));
            }
        }, 1000);
    });
}

function enviar_confirmacion_reserva(nombre_cliente, mesas_solicitadas) {
    return new Promise((resolve, reject) => {
        console.log(`Enviando confirmacion a ${nombre_cliente}`);
        
        setTimeout(() => {
            const exito_envio = Math.random() > 0.3;
            
            if (exito_envio) {
                console.log(`Confirmacion enviada exitosamente a ${nombre_cliente}`);
                resolve({
                    exito: true,
                    mensaje: `Correo de confirmacion enviado a ${nombre_cliente}`,
                    codigo: Math.floor(Math.random() * 10000)
                });
            } else {
                console.log(`Error al enviar confirmacion a ${nombre_cliente}`);
                reject(new Error(`No se pudo enviar el correo de confirmacion a ${nombre_cliente}. Intente nuevamente`));
            }
        }, 1500);
    });
}

async function hacer_reserva(nombre_cliente, mesas_solicitadas) {
    console.log(`\n=== Iniciando reserva para ${nombre_cliente} ===`);
    
    const reserva_id = contador_reserva_id++;
    
    const reserva_temporal = {
        id: reserva_id,
        nombre_cliente: nombre_cliente,
        mesas_solicitadas: mesas_solicitadas,
        estado: 'pendiente',
        timestamp: Date.now(),
        mensaje: 'Procesando...'
    };
    
    reservas.push(reserva_temporal);
    renderizar_reservas();
    
    try {
        const disponibilidad = await verificar_disponibilidad(mesas_solicitadas);
        
        mesas_ocupadas += mesas_solicitadas;
        actualizar_interfaz_mesas();
        
        const confirmacion = await enviar_confirmacion_reserva(nombre_cliente, mesas_solicitadas);
        
        const reserva_index = reservas.findIndex(r => r.id === reserva_id);
        if (reserva_index !== -1) {
            reservas[reserva_index].estado = 'exitosa';
            reservas[reserva_index].mensaje = confirmacion.mensaje;
            reservas[reserva_index].codigo_confirmacion = confirmacion.codigo;
        }
        
        renderizar_reservas();
        
        mostrar_mensaje(`Reserva exitosa para ${nombre_cliente}. Codigo: ${confirmacion.codigo}`, false);
        console.log(`Reserva completada exitosamente para ${nombre_cliente}`);
        
        return {
            exito: true,
            reserva_id: reserva_id,
            mensaje: confirmacion.mensaje,
            codigo: confirmacion.codigo
        };
        
    } catch (error) {
        console.log(`Error en reserva para ${nombre_cliente}:`, error.message);
        
        const reserva_index = reservas.findIndex(r => r.id === reserva_id);
        if (reserva_index !== -1) {
            reservas[reserva_index].estado = 'fallida';
            reservas[reserva_index].mensaje = error.message;
        }
        
        renderizar_reservas();
        
        mostrar_mensaje(`Error en reserva: ${error.message}`, true);
        
        throw error;
    }
}

function limpiar_todas_reservas() {
    mesas_ocupadas = 0;
    reservas = [];
    contador_reserva_id = 1;
    actualizar_interfaz_mesas();
    renderizar_reservas();
    mostrar_mensaje('Todas las reservas han sido eliminadas', false);
    console.log('Historial de reservas limpiado');
}

function actualizar_mesas_totales(nuevo_total) {
    if (nuevo_total < mesas_ocupadas) {
        mostrar_mensaje(`No se puede reducir las mesas por debajo de las ocupadas (${mesas_ocupadas})`, true);
        document.getElementById('total_mesas').value = mesas_totales;
        return;
    }
    
    mesas_totales = nuevo_total;
    actualizar_interfaz_mesas();
    mostrar_mensaje(`Total de mesas actualizado a ${mesas_totales}`, false);
    console.log(`Mesas totales actualizadas a ${mesas_totales}`);
}

document.getElementById('btn_hacer_reserva').addEventListener('click', async () => {
    const nombre_cliente = document.getElementById('nombre_cliente').value.trim();
    const mesas_solicitadas = parseInt(document.getElementById('mesas_solicitadas').value);
    
    if (!nombre_cliente) {
        mostrar_mensaje('Por favor ingrese el nombre del cliente', true);
        return;
    }
    
    if (isNaN(mesas_solicitadas) || mesas_solicitadas < 1 || mesas_solicitadas > 5) {
        mostrar_mensaje('Las mesas solicitadas deben ser entre 1 y 5', true);
        return;
    }
    
    const btn = document.getElementById('btn_hacer_reserva');
    const texto_original = btn.textContent;
    btn.textContent = `Procesando...`;
    btn.disabled = true;
    
    try {
        await hacer_reserva(nombre_cliente, mesas_solicitadas);
        document.getElementById('nombre_cliente').value = '';
        document.getElementById('mesas_solicitadas').value = '1';
    } catch (error) {
        console.log('Reserva fallida:', error.message);
    } finally {
        btn.textContent = texto_original;
        btn.disabled = false;
    }
});

document.getElementById('btn_actualizar_mesas').addEventListener('click', () => {
    const nuevo_total = parseInt(document.getElementById('total_mesas').value);
    
    if (isNaN(nuevo_total) || nuevo_total < 1) {
        mostrar_mensaje('Ingrese un numero valido de mesas', true);
        return;
    }
    
    actualizar_mesas_totales(nuevo_total);
});

document.getElementById('btn_limpiar_reservas').addEventListener('click', () => {
    if (confirm('Esta seguro de eliminar todas las reservas?')) {
        limpiar_todas_reservas();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    console.log('Sistema de Reservas Iniciado');
    console.log('Usando Promesas y Async Await');
    actualizar_interfaz_mesas();
});