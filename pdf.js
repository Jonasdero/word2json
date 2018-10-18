const fs = require('fs');
const path = require('path');
const word2pdf = require('word2pdf');

var input = './inputPDF';
var ouput = './outputPDF';

if (!fs.existsSync(path.join(__dirname, input)))
  fs.mkdirSync(path.join(__dirname, input));

if (!fs.existsSync(path.join(__dirname, ouput)))
  fs.mkdirSync(path.join(__dirname, ouput));

fs.readdir(input, function (err, filenames) {
  if (err) { console.error(err); return; }
  filenames.forEach(function (path) {
    toPDF(path);
  });
});

async function toPDF(path) {
  const data = await word2pdf(input + '/' + path)
  path = path.replace('docx', 'pdf');
  path = path.replace('doc', 'pdf');
  fs.writeFileSync(ouput + '/' + path, data);
}