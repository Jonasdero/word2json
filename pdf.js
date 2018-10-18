const fs = require('fs');
const path = require('path');
const word2pdf = require('word2pdf');

//Information where to save the document after it is created
var input = './inputPDF';
var ouput = './outputPDF';

//Checks if target directory exists and creates it if doesn't
if (!fs.existsSync(path.join(__dirname, input)))
  fs.mkdirSync(path.join(__dirname, input));

if (!fs.existsSync(path.join(__dirname, ouput)))
  fs.mkdirSync(path.join(__dirname, ouput));

//Checks for errors and shows them in the console
fs.readdir(input, function (err, filenames) {
  if (err) { console.error(err); return; }
  filenames.forEach(function (path) {
    toPDF(path);
  });
});

//Converts the inputfile to an .PDF file and changes its file extension from docx or doc to pdf
async function toPDF(path) {
  const data = await word2pdf(input + '/' + path)
  path = path.replace('docx', 'pdf');
  path = path.replace('doc', 'pdf');
  fs.writeFileSync(ouput + '/' + path, data);
}
