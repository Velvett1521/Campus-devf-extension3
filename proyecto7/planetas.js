import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const archivo_planetas = path.join(__dirname, 'datos', 'planetas.json');

const planetas_predefinidos = [
  {
    id: 1,
    nombre: 'Mercurio',
    tipo: 'Rocoso',
    distancia_sol: '57.9 millones km',
    diametro: '4,879 km',
    lunas: 0,
    descripcion: 'El planeta mas cercano al Sol',
    favorito: true
  },
  {
    id: 2,
    nombre: 'Venus',
    tipo: 'Rocoso',
    distancia_sol: '108.2 millones km',
    diametro: '12,104 km',
    lunas: 0,
    descripcion: 'El planeta mas caliente del sistema solar',
    favorito: true
  },
  {
    id: 3,
    nombre: 'Tierra',
    tipo: 'Rocoso',
    distancia_sol: '149.6 millones km',
    diametro: '12,742 km',
    lunas: 1,
    descripcion: 'Nuestro hogar, el unico con vida conocida',
    favorito: true
  },
  {
    id: 4,
    nombre: 'Marte',
    tipo: 'Rocoso',
    distancia_sol: '227.9 millones km',
    diametro: '6,779 km',
    lunas: 2,
    descripcion: 'El planeta rojo, objetivo de exploracion espacial',
    favorito: true
  },
  {
    id: 5,
    nombre: 'Jupiter',
    tipo: 'Gaseoso',
    distancia_sol: '778.5 millones km',
    diametro: '139,820 km',
    lunas: 79,
    descripcion: 'El planeta mas grande del sistema solar',
    favorito: true
  },
  {
    id: 6,
    nombre: 'Saturno',
    tipo: 'Gaseoso',
    distancia_sol: '1,434 millones km',
    diametro: '116,460 km',
    lunas: 82,
    descripcion: 'Famoso por sus anillos',
    favorito: true
  },
  {
    id: 7,
    nombre: 'Urano',
    tipo: 'Hielo',
    distancia_sol: '2,871 millones km',
    diametro: '50,724 km',
    lunas: 27,
    descripcion: 'Gira de lado',
    favorito: true
  },
  {
    id: 8,
    nombre: 'Neptuno',
    tipo: 'Hielo',
    distancia_sol: '4,495 millones km',
    diametro: '49,244 km',
    lunas: 14,
    descripcion: 'El planeta mas ventoso',
    favorito: true
  }
];

function inicializar_archivo() {
  if (!fs.existsSync(archivo_planetas)) {
    const dir = path.dirname(archivo_planetas);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(archivo_planetas, JSON.stringify(planetas_predefinidos, null, 2));
    console.log(chalk.green('Archivo de planetas inicializado'));
  }
}

function leer_planetas() {
  inicializar_archivo();
  const datos = fs.readFileSync(archivo_planetas, 'utf-8');
  return JSON.parse(datos);
}

function guardar_planetas(planetas) {
  fs.writeFileSync(archivo_planetas, JSON.stringify(planetas, null, 2));
}

function listar_planetas() {
  const planetas = leer_planetas();
  const favoritos = planetas.filter(p => p.favorito);
  
  console.log(chalk.cyan('\n========================================'));
  console.log(chalk.bold.yellow('   MIS PLANETAS FAVORITOS'));
  console.log(chalk.cyan('========================================\n'));
  
  favoritos.forEach((planeta, index) => {
    console.log(chalk.white(`${index + 1}. ${chalk.bold.green(planeta.nombre)}`));
    console.log(chalk.gray(`   Tipo: ${planeta.tipo}`));
    console.log(chalk.gray(`   Distancia del Sol: ${planeta.distancia_sol}`));
    console.log(chalk.gray(`   Diametro: ${planeta.diametro}`));
    console.log(chalk.gray(`   Lunas: ${planeta.lunas}`));
    console.log(chalk.gray(`   ${planeta.descripcion}`));
    console.log(chalk.cyan('  ----------------------------------------\n'));
  });
  
  console.log(chalk.yellow(`Total de planetas favoritos: ${favoritos.length}`));
  console.log(chalk.cyan('========================================\n'));
}

function agregar_planeta(nombre_nuevo) {
  const planetas = leer_planetas();
  const nombre_normalizado = nombre_nuevo.charAt(0).toUpperCase() + nombre_nuevo.slice(1).toLowerCase();
  
  const existe = planetas.some(p => p.nombre.toLowerCase() === nombre_normalizado.toLowerCase());
  
  if (existe) {
    console.log(chalk.yellow(`\nEl planeta ${nombre_normalizado} ya existe en la lista`));
    return;
  }
  
  const nuevo_id = planetas.length + 1;
  
  const nuevo_planeta = {
    id: nuevo_id,
    nombre: nombre_normalizado,
    tipo: 'Desconocido',
    distancia_sol: 'Por determinar',
    diametro: 'Por determinar',
    lunas: 0,
    descripcion: 'Planeta descubierto recientemente',
    favorito: true
  };
  
  planetas.push(nuevo_planeta);
  guardar_planetas(planetas);
  
  console.log(chalk.green(`\n¡Planeta ${nombre_normalizado} agregado exitosamente!`));
  console.log(chalk.gray('Puedes editar los datos manualmente en el archivo planetas.json'));
}

function mostrar_info_planeta(nombre_buscar) {
  const planetas = leer_planetas();
  const nombre_normalizado = nombre_buscar.charAt(0).toUpperCase() + nombre_buscar.slice(1).toLowerCase();
  
  const planeta = planetas.find(p => p.nombre.toLowerCase() === nombre_normalizado.toLowerCase());
  
  if (!planeta) {
    console.log(chalk.red(`\nPlaneta "${nombre_buscar}" no encontrado`));
    console.log(chalk.gray('Usa "npm run listar" para ver los planetas disponibles'));
    return;
  }
  
  console.log(chalk.cyan('\n========================================'));
  console.log(chalk.bold.yellow(`   INFORMACION DE ${planeta.nombre.toUpperCase()}`));
  console.log(chalk.cyan('========================================\n'));
  console.log(chalk.white(`${chalk.bold('Nombre:')} ${planeta.nombre}`));
  console.log(chalk.white(`${chalk.bold('Tipo:')} ${planeta.tipo}`));
  console.log(chalk.white(`${chalk.bold('Distancia del Sol:')} ${planeta.distancia_sol}`));
  console.log(chalk.white(`${chalk.bold('Diametro:')} ${planeta.diametro}`));
  console.log(chalk.white(`${chalk.bold('Lunas:')} ${planeta.lunas}`));
  console.log(chalk.white(`${chalk.bold('Descripcion:')} ${planeta.descripcion}`));
  console.log(chalk.white(`${chalk.bold('Favorito:')} ${planeta.favorito ? 'Si' : 'No'}`));
  console.log(chalk.cyan('========================================\n'));
}

function obtener_resumen() {
  const planetas = leer_planetas();
  const favoritos = planetas.filter(p => p.favorito);
  const rocosos = planetas.filter(p => p.tipo === 'Rocoso');
  const gaseosos = planetas.filter(p => p.tipo === 'Gaseoso');
  const hielo = planetas.filter(p => p.tipo === 'Hielo');
  
  console.log(chalk.cyan('\n========================================'));
  console.log(chalk.bold.yellow('   RESUMEN DEL SISTEMA SOLAR'));
  console.log(chalk.cyan('========================================\n'));
  console.log(chalk.white(`${chalk.bold('Total planetas:')} ${planetas.length}`));
  console.log(chalk.white(`${chalk.bold('Favoritos:')} ${favoritos.length}`));
  console.log(chalk.white(`${chalk.bold('Planetas rocosos:')} ${rocosos.length}`));
  console.log(chalk.white(`${chalk.bold('Planetas gaseosos:')} ${gaseosos.length}`));
  console.log(chalk.white(`${chalk.bold('Planetas de hielo:')} ${hielo.length}`));
  
  const total_lunas = planetas.reduce((sum, p) => sum + p.lunas, 0);
  console.log(chalk.white(`${chalk.bold('Total lunas:')} ${total_lunas}`));
  
  console.log(chalk.cyan('\n========================================\n'));
}

function toggle_favorito(nombre_planeta) {
  const planetas = leer_planetas();
  const planeta = planetas.find(p => p.nombre.toLowerCase() === nombre_planeta.toLowerCase());
  
  if (!planeta) {
    console.log(chalk.red(`Planeta "${nombre_planeta}" no encontrado`));
    return;
  }
  
  planeta.favorito = !planeta.favorito;
  guardar_planetas(planetas);
  
  const estado = planeta.favorito ? 'agregado a favoritos' : 'eliminado de favoritos';
  console.log(chalk.green(`\n${planeta.nombre} ha sido ${estado}`));
}

export { 
  listar_planetas, 
  agregar_planeta, 
  mostrar_info_planeta, 
  obtener_resumen,
  toggle_favorito
};