const { default: inquirer } = require('inquirer');
const { spawn } = require('child_process');

const questions = [
  {
    type: 'list',
    name: 'file',
    message: 'Whats the project you want to run?:',
    choices: [
      'user',
      'admin',
      'ui',
    ],
  },
];

inquirer.prompt(questions).then((answers) => {
  let command, args;

  if (answers.file === 'user') {
    command = 'yarn';
    args = ['workspace', '@entrydsm/user', 'run', 'start'];
  } else if (answers.file === 'admin') {
    command = 'yarn';
    args = ['workspace', '@entrydsm/admin', 'run', 'start'];
  } else if (answers.file === 'ui') {
    command = 'yarn';
    args = ['workspace', '@entrydsm/ui', 'run', 'start'];

  const child = spawn(command, args, { shell: true });

  child.stdout.on('data', (data) => {
    console.log(`${data}`);
  });

  child.stderr.on('data', (data) => {
    console.error(`${data}`);
  });

  child.on('close', (code) => {
    console.log(`Child process exited with code ${code}`);
  });
}});