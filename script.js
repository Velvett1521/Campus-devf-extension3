const proyectos_info = {
  Proyecto1: {
    nombre: 'Cafeteria Asincronica',
    archivos: ['index.html', 'cafeteria.js'],
    repo: 'https://github.com/Velvett1521/Campus-devf-extension3/tree/main/Proyecto1'
  },
  proyecto2: {
    nombre: 'Biblioteca Virtual',
    archivos: ['index.html', 'biblioteca.js'],
    repo: 'https://github.com/Velvett1521/Campus-devf-extension3/tree/main/proyecto2'
  },
  proyecto3: {
    nombre: 'Rick & Morty API',
    archivos: ['index.html', 'app.js'],
    repo: 'https://github.com/Velvett1521/Campus-devf-extension3/tree/main/proyecto3'
  },
  proyecto4: {
    nombre: 'Sistema de Reservas',
    archivos: ['index.html', 'reservas.js'],
    repo: 'https://github.com/Velvett1521/Campus-devf-extension3/tree/main/proyecto4'
  },
  proyecto5: {
    nombre: 'Registro de Eventos',
    archivos: ['index.html', 'formulario.js', 'styles.css'],
    repo: 'https://github.com/Velvett1521/Campus-devf-extension3/tree/main/proyecto5'
  },
  proyecto6: {
    nombre: 'Validacion con Zod',
    archivos: ['index.html', 'validacion.js'],
    repo: 'https://github.com/Velvett1521/Campus-devf-extension3/tree/main/proyecto6'
  },
  proyecto7: {
    nombre: 'Explorador de Planetas',
    archivos: ['index.js', 'planetas.js', 'utils/helpers.js', 'datos/planetas.json', 'package.json'],
    repo: 'https://github.com/Velvett1521/Campus-devf-extension3/tree/main/proyecto7',
    es_node: true
  },
  proyecto8: {
    nombre: 'Adivina el Numero',
    archivos: ['index.html', 'src/main.js', 'src/style.css', 'src/modules/'],
    repo: 'https://github.com/Velvett1521/Campus-devf-extension3/tree/main/proyecto8'
  }
};

function verCodigo(proyecto_id) {
  const modal = document.getElementById('modal_codigo');
  const modal_body = document.getElementById('modal_body');
  const info = proyectos_info[proyecto_id];
  
  if (info) {
    if (info.es_node) {
      modal_body.innerHTML = `
        <div class="sin-proyecto">
          <p><strong>${info.nombre}</strong></p>
          <p>Este es un proyecto de Node.js (CLI)</p>
          <p>Archivos del proyecto: ${info.archivos.join(', ')}</p>
          <p><strong>Instrucciones para ejecutar:</strong></p>
          <pre style="background: #0f0f1a; padding: 15px; border-radius: 10px; overflow-x: auto; margin: 10px 0;">
cd proyecto7
npm install
npm start
npm run listar
npm run agregar -- Marte
npm run info -- Tierra
npm run resumen
npm run help
          </pre>
          <p>Para ver el codigo completo, revisa el repositorio:</p>
          <a href="${info.repo}" class="btn-repo" target="_blank">Ver en GitHub</a>
        </div>
      `;
    } else {
      modal_body.innerHTML = `
        <div class="sin-proyecto">
          <p><strong>${info.nombre}</strong></p>
          <p>Archivos del proyecto: ${info.archivos.join(', ')}</p>
          <p>Para ver el codigo completo, revisa el repositorio:</p>
          <a href="${info.repo}" class="btn-repo" target="_blank">Ver en GitHub</a>
          <p style="margin-top: 15px; font-size: 0.8em;">O puedes inspeccionar el codigo directamente desde la Demo (F12)</p>
        </div>
      `;
    }
  } else {
    modal_body.innerHTML = `
      <div class="sin-proyecto">
        <p>Informacion del proyecto no disponible</p>
        <p>Revisa el repositorio principal para mas detalles</p>
      </div>
    `;
  }
  
  modal.style.display = 'block';
}

function mostrarInstruccionesNode() {
  const modal = document.getElementById('modal_node');
  const modal_body = document.getElementById('modal_node_body');
  
  modal_body.innerHTML = `
    <div class="sin-proyecto">
      <p><strong>Explorador de Planetas - Node.js CLI</strong></p>
      <p>Una aplicacion de terminal para explorar el sistema solar</p>
      
      <p><strong>Requisitos previos:</strong></p>
      <pre style="background: #0f0f1a; padding: 10px; border-radius: 8px; margin: 10px 0;">
Node.js v18 o superior
      </pre>
      
      <p><strong>Instalacion:</strong></p>
      <pre style="background: #0f0f1a; padding: 10px; border-radius: 8px; margin: 10px 0;">
cd proyecto7
npm install
      </pre>
      
      <p><strong>Comandos disponibles:</strong></p>
      <pre style="background: #0f0f1a; padding: 10px; border-radius: 8px; margin: 10px 0;">
npm start              - Inicia la aplicacion
npm run listar         - Muestra todos los planetas favoritos
npm run agregar        - Agrega un nuevo planeta
npm run info           - Muestra informacion de un planeta
npm run resumen        - Muestra estadisticas del sistema solar
npm run help           - Muestra la ayuda
      </pre>
      
      <p><strong>Ejemplos:</strong></p>
      <pre style="background: #0f0f1a; padding: 10px; border-radius: 8px; margin: 10px 0;">
npm run agregar -- Pluton
npm run info -- Marte
npm run listar
      </pre>
      
      <p><strong>Caracteristicas:</strong></p>
      <ul style="text-align: left; margin: 10px 0; padding-left: 20px;">
        <li>8 planetas predefinidos del sistema solar</li>
        <li>Colores en consola con Chalk</li>
        <li>Banner con Figlet</li>
        <li>Persistencia de datos en JSON</li>
        <li>Sistema de modulos ES</li>
      </ul>
    </div>
  `;
  
  modal.style.display = 'block';
}

function cerrarModal() {
  const modal_codigo = document.getElementById('modal_codigo');
  const modal_node = document.getElementById('modal_node');
  if (modal_codigo) modal_codigo.style.display = 'none';
  if (modal_node) modal_node.style.display = 'none';
}

function filtrarProyectos() {
  const filtro_activo = document.querySelector('.filtro-btn.activo').dataset.filtro;
  const tarjetas = document.querySelectorAll('.tarjeta');
  
  tarjetas.forEach(tarjeta => {
    if (filtro_activo === 'todos') {
      tarjeta.style.display = 'block';
    } else {
      const categoria = tarjeta.dataset.categoria;
      if (categoria === filtro_activo) {
        tarjeta.style.display = 'block';
      } else {
        tarjeta.style.display = 'none';
      }
    }
  });
}

document.querySelectorAll('.filtro-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('activo'));
    btn.classList.add('activo');
    filtrarProyectos();
  });
});

document.querySelectorAll('.modal-close, .modal-close-node').forEach(btn => {
  if (btn) {
    btn.addEventListener('click', cerrarModal);
  }
});

window.addEventListener('click', (e) => {
  const modal_codigo = document.getElementById('modal_codigo');
  const modal_node = document.getElementById('modal_node');
  if (e.target === modal_codigo) cerrarModal();
  if (e.target === modal_node) cerrarModal();
});

window.verCodigo = verCodigo;
window.mostrarInstruccionesNode = mostrarInstruccionesNode;

console.log('Catalogo de proyectos cargado');
console.log('Proyectos disponibles: 1,2,3,4,5,6,7,8');