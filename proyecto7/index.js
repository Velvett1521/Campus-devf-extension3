import { programar_bienvenida, mostrar_ayuda } from './utils/helpers.js';
import { 
  listar_planetas, 
  agregar_planeta, 
  mostrar_info_planeta,
  obtener_resumen 
} from './planetas.js';

function procesar_comando() {
  const args = process.argv.slice(2);
  const comando = args[0];
  const parametro = args[1];

  switch (comando) {
    case 'listar':
      listar_planetas();
      break;
    
    case 'agregar':
      if (!parametro) {
        console.log('Error: Debes especificar el nombre del planeta');
        console.log('Ejemplo: npm run agregar -- Marte');
        return;
      }
      agregar_planeta(parametro);
      break;
    
    case 'info':
      if (!parametro) {
        console.log('Error: Debes especificar el nombre del planeta');
        console.log('Ejemplo: npm run info -- Marte');
        return;
      }
      mostrar_info_planeta(parametro);
      break;
    
    case 'resumen':
      obtener_resumen();
      break;
    
    case 'help':
    case '--help':
    case '-h':
      mostrar_ayuda();
      break;
    
    default:
      if (comando && comando !== 'start') {
        console.log(`Comando desconocido: ${comando}`);
        console.log('Usa "npm run help" para ver los comandos disponibles');
      } else {
        programar_bienvenida();
        listar_planetas();
      }
      break;
  }
}

procesar_comando();