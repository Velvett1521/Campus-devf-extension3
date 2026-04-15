import chalk from 'chalk';
import figlet from 'figlet';

function programar_bienvenida() {
  console.log(chalk.cyan('\n========================================'));
  
  figlet.text('Planet Explorer', {
    font: 'Standard',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 80,
    whitespaceBreak: true
  }, (error, data) => {
    if (error) {
      console.log(chalk.yellow('Bienvenido al Explorador de Planetas'));
    } else {
      console.log(chalk.magenta(data));
    }
    console.log(chalk.cyan('========================================'));
    console.log(chalk.white('Tu herramienta para explorar el universo'));
    console.log(chalk.gray('Comandos disponibles: npm run help\n'));
  });
}

function mostrar_ayuda() {
  console.log(chalk.cyan('\n========================================'));
  console.log(chalk.bold.yellow('   COMANDOS DISPONIBLES'));
  console.log(chalk.cyan('========================================\n'));
  console.log(chalk.white(`${chalk.bold('npm start')}        - Inicia la aplicacion`));
  console.log(chalk.white(`${chalk.bold('npm run listar')}   - Muestra todos los planetas favoritos`));
  console.log(chalk.white(`${chalk.bold('npm run agregar')}  - Agrega un nuevo planeta`));
  console.log(chalk.white(`                     Ejemplo: npm run agregar -- Marte`));
  console.log(chalk.white(`${chalk.bold('npm run info')}     - Muestra informacion de un planeta`));
  console.log(chalk.white(`                     Ejemplo: npm run info -- Marte`));
  console.log(chalk.white(`${chalk.bold('npm run help')}     - Muestra esta ayuda`));
  console.log(chalk.cyan('\n========================================\n'));
}

export { programar_bienvenida, mostrar_ayuda };