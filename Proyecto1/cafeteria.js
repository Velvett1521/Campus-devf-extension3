class CafeteriaSimulator {
    constructor() {
        this.pedidos = [];
        this.pedido_id_counter = 1;
        this.total_pedidos = 0;
        this.en_proceso = 0;
        this.completados = 0;
        
        this.lista_pedidos_el = document.getElementById('lista_pedidos');
        this.total_pedidos_el = document.getElementById('total_pedidos');
        this.en_proceso_el = document.getElementById('en_proceso');
        this.completados_el = document.getElementById('completados');
        
        this.init_event_listeners();
    }
    
    init_event_listeners() {
        document.getElementById('btn_agregar_pedido').addEventListener('click', () => {
            this.agregar_nuevo_pedido();
        });
    }
    
    generar_tiempo_preparacion() {
        return Math.floor(Math.random() * (5000 - 2000 + 1) + 2000);
    }
    
    actualizar_estadisticas() {
        this.total_pedidos_el.textContent = this.total_pedidos;
        this.en_proceso_el.textContent = this.en_proceso;
        this.completados_el.textContent = this.completados;
    }
    
    renderizar_pedidos() {
        if (this.pedidos.length === 0) {
            this.lista_pedidos_el.innerHTML = `
                <div class="empty-message">
                    No hay pedidos aun. Agrega tu primer pedido
                </div>
            `;
            return;
        }
        
        this.lista_pedidos_el.innerHTML = this.pedidos.map(pedido => `
            <div class="pedido-item" data-id="${pedido.id}">
                <div class="pedido-id">#${pedido.id}</div>
                <div>
                    <span class="pedido-estado ${pedido.estado === 'En Proceso' ? 'estado-proceso' : 'estado-completado'}">
                        ${pedido.estado}
                        ${pedido.estado === 'En Proceso' ? '<span class="loading"></span>' : ' '}
                    </span>
                </div>
                <div class="pedido-tiempo">
                    ${pedido.tiempo_preparacion ? (pedido.tiempo_preparacion / 1000).toFixed(1) + 's' : 'Calculando...'}
                </div>
            </div>
        `).join('');
    }
    
    agregar_nuevo_pedido() {
        const tiempo_preparacion = this.generar_tiempo_preparacion();
        const nuevo_pedido = {
            id: this.pedido_id_counter++,
            estado: 'En Proceso',
            tiempo_preparacion: tiempo_preparacion,
            timestamp: Date.now()
        };
        
        this.pedidos.push(nuevo_pedido);
        this.total_pedidos++;
        this.en_proceso++;
        
        console.log(`Pedido #${nuevo_pedido.id} recibido. Tiempo estimado: ${tiempo_preparacion/1000}s`);
        
        this.actualizar_estadisticas();
        this.renderizar_pedidos();
        
        this.procesar_pedido_con_async_await(nuevo_pedido);
    }
    
    preparar_pedido(pedido) {
        console.log(`Barista comenzando a preparar pedido #${pedido.id}`);
        
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`Pedido #${pedido.id} listo despues de ${pedido.tiempo_preparacion/1000}s`);
                resolve(pedido);
            }, pedido.tiempo_preparacion);
        });
    }
    
    async procesar_pedido_con_async_await(pedido) {
        try {
            const pedido_listo = await this.preparar_pedido(pedido);
            this.actualizar_estado_pedido(pedido_listo.id, 'Completado');
            console.log(`Pedido #${pedido.id} completado y entregado al cliente`);
        } catch (error) {
            console.error(`Error procesando pedido #${pedido.id}:`, error);
        }
    }
    
    actualizar_estado_pedido(pedido_id, nuevo_estado) {
        const pedido_index = this.pedidos.findIndex(p => p.id === pedido_id);
        
        if (pedido_index !== -1) {
            if (this.pedidos[pedido_index].estado === 'En Proceso' && nuevo_estado === 'Completado') {
                this.en_proceso--;
                this.completados++;
            }
            
            this.pedidos[pedido_index].estado = nuevo_estado;
            
            this.actualizar_estadisticas();
            this.renderizar_pedidos();
        }
    }
}

function demostrar_event_loop() {
    console.log('Demostracion del Event Loop');
    console.log('1. Codigo sincrono - Inicio');
    
    setTimeout(() => {
        console.log('4. setTimeout - Macrotask');
    }, 0);
    
    Promise.resolve().then(() => {
        console.log('3. Promise - Microtask');
    });
    
    console.log('2. Codigo sincrono - Fin');
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Iniciando Simulador de Cafeteria');
    demostrar_event_loop();
    const cafeteria = new CafeteriaSimulator();
    
    setTimeout(() => {
        console.log('Puedes agregar multiples pedidos y ver como se procesan en paralelo');
    }, 1000);
});