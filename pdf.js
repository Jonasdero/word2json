const fs = require('fs');
const path = require('path');
const word2pdf = require('word2pdf');

//Information where to save the document after it is created
//Angabe wo die zu erstellende Datei gespeichert werden soll
var input = './inputPDF';
var ouput = './outputPDF';

//Checks if target directory exists and creates it if doesn't
//Überprüfung, ob das Zielverzeichnis schon existiert. Tut es das nicht, wird es angelegt
if (!fs.existsSync(path.join(__dirname, input)))
  fs.mkdirSync(path.join(__dirname, input));

if (!fs.existsSync(path.join(__dirname, ouput)))
  fs.mkdirSync(path.join(__dirname, ouput));

//Checks for errors and shows them in the console
//Abfangen und Ausgeben von Fehlern in der Konsole
fs.readdir(input, function (err, filenames) {
  if (err) { console.error(err); return; }
  filenames.forEach(function (path) {
    toPDF(path);
  });
});

//Converts the inputfile to an .PDF file and changes its file extension from docx or doc to pdf
//Konvertiert die Eingangsdatei in eine .PDF Datei und ändert die Dateiendung von docx oder doc zu pdf
async function toPDF(path) {
  const data = await word2pdf(input + '/' + path)
  path = path.replace('docx', 'pdf');
  path = path.replace('doc', 'pdf');
  fs.writeFileSync(ouput + '/' + path, data);
}
