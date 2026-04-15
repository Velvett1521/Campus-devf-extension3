let pagina_actual = 1;
let total_paginas = 1;
let metodo_actual = null;

function mostrar_loading() {
    const contenedor = document.getElementById('data_container');
    contenedor.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Cargando personajes...</p>
        </div>
    `;
}

function mostrar_error(mensaje) {
    const contenedor = document.getElementById('data_container');
    contenedor.innerHTML = `
        <div class="error">
            <strong>Error:</strong> ${mensaje}
        </div>
    `;
}

function mostrar_personajes(personajes) {
    const contenedor = document.getElementById('data_container');
    
    if (!personajes || personajes.length === 0) {
        contenedor.innerHTML = '<div class="empty">No se encontraron personajes</div>';
        return;
    }
    
    const characters_grid = document.createElement('div');
    characters_grid.className = 'characters-grid';
    
    personajes.forEach(personaje => {
        let status_class = '';
        if (personaje.status === 'Alive') {
            status_class = 'status-alive';
        } else if (personaje.status === 'Dead') {
            status_class = 'status-dead';
        } else {
            status_class = 'status-unknown';
        }
        
        const card = document.createElement('div');
        card.className = 'character-card';
        card.innerHTML = `
            <img class="character-image" src="${personaje.image}" alt="${personaje.name}">
            <div class="character-info">
                <div class="character-name">${personaje.name}</div>
                <div class="character-species">${personaje.species} - ${personaje.gender}</div>
                <div class="character-status ${status_class}">${personaje.status}</div>
            </div>
        `;
        characters_grid.appendChild(card);
    });
    
    contenedor.innerHTML = '';
    contenedor.appendChild(characters_grid);
}

function actualizar_paginacion() {
    const pag_container = document.getElementById('pagination_container');
    
    if (total_paginas <= 1) {
        pag_container.innerHTML = '';
        return;
    }
    
    pag_container.innerHTML = `
        <div class="pagination">
            <button class="page-btn" id="btn_anterior" ${pagina_actual === 1 ? 'disabled' : ''}>
                Anterior
            </button>
            <span class="page-info">Pagina ${pagina_actual} de ${total_paginas}</span>
            <button class="page-btn" id="btn_siguiente" ${pagina_actual === total_paginas ? 'disabled' : ''}>
                Siguiente
            </button>
        </div>
    `;
    
    const btn_anterior = document.getElementById('btn_anterior');
    const btn_siguiente = document.getElementById('btn_siguiente');
    
    if (btn_anterior) {
        btn_anterior.addEventListener('click', () => {
            if (pagina_actual > 1) {
                pagina_actual--;
                if (metodo_actual === 'fetch') {
                    obtener_con_fetch(pagina_actual);
                } else if (metodo_actual === 'axios') {
                    obtener_con_axios(pagina_actual);
                }
            }
        });
    }
    
    if (btn_siguiente) {
        btn_siguiente.addEventListener('click', () => {
            if (pagina_actual < total_paginas) {
                pagina_actual++;
                if (metodo_actual === 'fetch') {
                    obtener_con_fetch(pagina_actual);
                } else if (metodo_actual === 'axios') {
                    obtener_con_axios(pagina_actual);
                }
            }
        });
    }
}

async function obtener_con_fetch(pagina = 1) {
    metodo_actual = 'fetch';
    pagina_actual = pagina;
    
    mostrar_loading();
    
    const url = `https://rickandmortyapi.com/api/character?page=${pagina}`;
    
    try {
        const respuesta = await fetch(url);
        
        if (!respuesta.ok) {
            throw new Error(`HTTP error! status: ${respuesta.status}`);
        }
        
        const datos = await respuesta.json();
        
        total_paginas = datos.info.pages;
        
        mostrar_personajes(datos.results);
        actualizar_paginacion();
        
        console.log('Fetch - Datos obtenidos:', datos.info);
        
    } catch (error) {
        console.error('Error en fetch:', error);
        mostrar_error(`Fetch fallo: ${error.message}`);
    }
}

async function obtener_con_axios(pagina = 1) {
    metodo_actual = 'axios';
    pagina_actual = pagina;
    
    mostrar_loading();
    
    const url = `https://rickandmortyapi.com/api/character?page=${pagina}`;
    
    try {
        const respuesta = await axios.get(url);
        
        total_paginas = respuesta.data.info.pages;
        
        mostrar_personajes(respuesta.data.results);
        actualizar_paginacion();
        
        console.log('Axios - Datos obtenidos:', respuesta.data.info);
        
    } catch (error) {
        console.error('Error en axios:', error);
        
        let mensaje_error = 'Error desconocido';
        if (error.response) {
            mensaje_error = `Error ${error.response.status}: ${error.response.statusText}`;
        } else if (error.request) {
            mensaje_error = 'No se recibio respuesta del servidor';
        } else {
            mensaje_error = error.message;
        }
        
        mostrar_error(`Axios fallo: ${mensaje_error}`);
    }
}

document.getElementById('btn_fetch').addEventListener('click', () => {
    pagina_actual = 1;
    obtener_con_fetch(1);
});

document.getElementById('btn_axios').addEventListener('click', () => {
    pagina_actual = 1;
    obtener_con_axios(1);
});

document.addEventListener('DOMContentLoaded', () => {
    console.log('Aplicacion iniciada');
    console.log('Usando Fetch y Axios para consumir API de Rick and Morty');
});