let base_datos_libros = {
    libros: [
        {
            id: 1,
            titulo: "Cien anos de soledad",
            autor: "Gabriel Garcia Marquez",
            genero: "Novela",
            disponible: true
        },
        {
            id: 2,
            titulo: "El principito",
            autor: "Antoine de Saint-Exupery",
            genero: "Infantil",
            disponible: true
        },
        {
            id: 3,
            titulo: "1984",
            autor: "George Orwell",
            genero: "Ciencia ficcion",
            disponible: false
        }
    ],
    ultimo_id: 3
};

let contador_id = 4;

function mostrar_mensaje(mensaje, es_error = false) {
    const mensaje_div = document.getElementById('mensaje');
    mensaje_div.textContent = mensaje;
    mensaje_div.style.backgroundColor = es_error ? '#d63031' : '#00b894';
    mensaje_div.style.display = 'block';
    
    setTimeout(() => {
        mensaje_div.style.display = 'none';
    }, 3000);
}

function leer_datos(callback) {
    console.log('Leyendo datos del sistema...');
    
    setTimeout(() => {
        const datos = JSON.parse(JSON.stringify(base_datos_libros));
        console.log('Lectura completada');
        callback(null, datos);
    }, 500);
}

function escribir_datos(nuevos_datos, callback) {
    console.log('Guardando datos en el sistema...');
    
    setTimeout(() => {
        base_datos_libros = JSON.parse(JSON.stringify(nuevos_datos));
        console.log('Datos guardados exitosamente');
        callback(null, { exito: true, mensaje: 'Datos guardados' });
    }, 500);
}

function consultar_libros(callback) {
    leer_datos((error, datos) => {
        if (error) {
            callback(error, null);
            return;
        }
        
        console.log('Libros en la biblioteca:', datos.libros);
        callback(null, datos.libros);
    });
}

function agregar_libro(titulo, autor, genero, callback) {
    if (!titulo || !autor || !genero) {
        callback(new Error('Todos los campos son obligatorios'), null);
        return;
    }
    
    leer_datos((error, datos) => {
        if (error) {
            callback(error, null);
            return;
        }
        
        const nuevo_libro = {
            id: contador_id++,
            titulo: titulo,
            autor: autor,
            genero: genero,
            disponible: true
        };
        
        datos.libros.push(nuevo_libro);
        datos.ultimo_id = contador_id - 1;
        
        escribir_datos(datos, (error_escritura, resultado) => {
            if (error_escritura) {
                callback(error_escritura, null);
                return;
            }
            
            console.log(`Libro "${titulo}" agregado correctamente`);
            callback(null, nuevo_libro);
        });
    });
}

function actualizar_disponibilidad(id_libro, nuevo_estado, callback) {
    if (!id_libro || typeof nuevo_estado !== 'boolean') {
        callback(new Error('ID invalido o estado incorrecto'), null);
        return;
    }
    
    leer_datos((error, datos) => {
        if (error) {
            callback(error, null);
            return;
        }
        
        const libro_index = datos.libros.findIndex(libro => libro.id === id_libro);
        
        if (libro_index === -1) {
            callback(new Error(`Libro con ID ${id_libro} no encontrado`), null);
            return;
        }
        
        const estado_anterior = datos.libros[libro_index].disponible;
        datos.libros[libro_index].disponible = nuevo_estado;
        
        escribir_datos(datos, (error_escritura, resultado) => {
            if (error_escritura) {
                callback(error_escritura, null);
                return;
            }
            
            const estado_texto = nuevo_estado ? 'disponible' : 'prestado';
            console.log(`Libro ID ${id_libro} actualizado a ${estado_texto}`);
            callback(null, { 
                libro: datos.libros[libro_index], 
                estado_anterior: estado_anterior,
                estado_nuevo: nuevo_estado 
            });
        });
    });
}

function renderizar_libros(libros) {
    const lista_libros_div = document.getElementById('lista_libros');
    
    if (!libros || libros.length === 0) {
        lista_libros_div.innerHTML = '<div class="libro-item">No hay libros en el inventario</div>';
        return;
    }
    
    lista_libros_div.innerHTML = libros.map(libro => `
        <div class="libro-item">
            <div class="libro-titulo">
                ${libro.titulo}
                <span class="libro-disponible disponible-${libro.disponible}">
                    ${libro.disponible ? 'Disponible' : 'Prestado'}
                </span>
            </div>
            <div class="libro-detalle">
                <strong>ID:</strong> ${libro.id} | 
                <strong>Autor:</strong> ${libro.autor} | 
                <strong>Genero:</strong> ${libro.genero}
            </div>
            <div>
                <button class="btn-prestar" onclick="window.prestar_libro(${libro.id})" ${!libro.disponible ? 'disabled' : ''}>
                    Prestar
                </button>
                <button class="btn-devolver" onclick="window.devolver_libro(${libro.id})" ${libro.disponible ? 'disabled' : ''}>
                    Devolver
                </button>
            </div>
        </div>
    `).join('');
}

function actualizar_interfaz() {
    consultar_libros((error, libros) => {
        if (error) {
            mostrar_mensaje(`Error al consultar: ${error.message}`, true);
            return;
        }
        
        renderizar_libros(libros);
        mostrar_mensaje('Inventario actualizado', false);
    });
}

window.prestar_libro = function(id_libro) {
    actualizar_disponibilidad(id_libro, false, (error, resultado) => {
        if (error) {
            mostrar_mensaje(`Error: ${error.message}`, true);
            return;
        }
        
        mostrar_mensaje(`Libro prestado exitosamente`, false);
        actualizar_interfaz();
    });
};

window.devolver_libro = function(id_libro) {
    actualizar_disponibilidad(id_libro, true, (error, resultado) => {
        if (error) {
            mostrar_mensaje(`Error: ${error.message}`, true);
            return;
        }
        
        mostrar_mensaje(`Libro devuelto exitosamente`, false);
        actualizar_interfaz();
    });
};

document.getElementById('btn_agregar').addEventListener('click', () => {
    const titulo = document.getElementById('titulo_libro').value;
    const autor = document.getElementById('autor_libro').value;
    const genero = document.getElementById('genero_libro').value;
    
    if (!titulo || !autor || !genero) {
        mostrar_mensaje('Por favor complete todos los campos', true);
        return;
    }
    
    agregar_libro(titulo, autor, genero, (error, nuevo_libro) => {
        if (error) {
            mostrar_mensaje(`Error: ${error.message}`, true);
            return;
        }
        
        mostrar_mensaje(`Libro "${titulo}" agregado correctamente`, false);
        document.getElementById('titulo_libro').value = '';
        document.getElementById('autor_libro').value = '';
        document.getElementById('genero_libro').value = '';
        actualizar_interfaz();
    });
});

document.getElementById('btn_actualizar').addEventListener('click', () => {
    const id_libro = parseInt(document.getElementById('libro_id').value);
    const nuevo_estado = document.getElementById('nuevo_estado').value === 'true';
    
    if (!id_libro) {
        mostrar_mensaje('Por favor ingrese un ID valido', true);
        return;
    }
    
    actualizar_disponibilidad(id_libro, nuevo_estado, (error, resultado) => {
        if (error) {
            mostrar_mensaje(`Error: ${error.message}`, true);
            return;
        }
        
        const estado_texto = nuevo_estado ? 'disponible' : 'prestado';
        mostrar_mensaje(`Libro actualizado a ${estado_texto}`, false);
        document.getElementById('libro_id').value = '';
        actualizar_interfaz();
    });
});

document.getElementById('btn_consultar').addEventListener('click', () => {
    actualizar_interfaz();
});

document.addEventListener('DOMContentLoaded', () => {
    console.log('Sistema de Biblioteca Iniciado');
    console.log('Usando Callbacks para operaciones asincronas');
    
    setTimeout(() => {
        actualizar_interfaz();
    }, 100);
});