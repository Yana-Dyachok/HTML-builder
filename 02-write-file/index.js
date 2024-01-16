const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = process;
const filePathTxt = path.join(__dirname, "result.txt");

const writeStream = fs.createWriteStream(filePathTxt, { flags: 'w' });
writeStream.on('error', (error) => {
  console.error(`get error: ${error}`);
  exit(1);
});

stdout.write("Hello! Let's create file, if you want to exit, please enter 'exit' or press Ctrl+C\nPlease enter any text and press 'enter':");

stdin.on('data', (data) => {
  const input = data.toString();
  if (input.trim() === 'exit') {
    stdout.write('\nYou finished! Thanks. Goodbye!');
    exit();
  }
  if (input.trim() === '') {
    stdout.write("\nThe text didn't enter, please try again:");
  }
  else {
    writeStream.write(`${input}\n`);
    stdout.write("The text was added to result.txt.\nPlease enter more text and press 'enter':");
  }
});

process.on('SIGINT', () => {
  stdout.write('\nYou finished! Thanks. Goodbye!');
  exit();
});