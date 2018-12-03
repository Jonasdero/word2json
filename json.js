const fs = require('fs');
const path = require('path');

const mammoth = require("mammoth");
const himalaya = require("himalaya");

// Information where to save the document after it is created
// Angabe wo die zu erstellende Datei gespeichert werden soll
var saveFileName = 'result.json';
var dir = './inputJSON';

process.argv.forEach(function (val, index, array) {
  if (val === '--path')
    dir = array[index++];
});

// Sets the required metadata for the documenthead
// Festlegen der notwendigen Metadaten im Dokumentenkopf
var settings = {
  vorname: "Jonas",
  nachname: "Roser",
  ausbildungsStart: "07.09.2016",
  ausbildungsStartDate: null,
  beruf: "Fachinformatiker Anwendungsentwicklung",
  spe: "Siemens Professional Education Paderborn",
  atiw: "Atiw Paderborn",
  praxis: "Atos, AIS GER HR PD Azubi"
};

var weeks = [];
var length = -1;


function germanLocalToDate(dateString) {
  var parts = dateString.split('.');
  return new Date(+parts[2], +parts[1] - 1, +parts[0]);
}
settings.ausbildungsStartDate = germanLocalToDate(settings.ausbildungsStart);

// Checks if target directory exists and creates it if doesn't
// Überprüfung, ob das Zielverzeichnis schon existiert. Tut es das nicht, wird es angelegt
if (fs.existsSync(path.resolve(saveFileName)))
  fs.unlinkSync(path.resolve(saveFileName));

if (!fs.existsSync(path.resolve(dir)))
  fs.mkdirSync(path.resolve(dir));

fs.readdir(dir, function (err, filenames) {
  if (err) { console.error(err); return; }
  length = filenames.length;
  filenames.forEach(function (path) {
    convertToHtml(dir + '/' + path);
  });
});

function convertToHtml(path) {
  mammoth.convertToHtml({ path: path }).then(html => {
    html.value = html.value.split('</p>').slice(1).join('</p>');
    parseJSON(himalaya.parse(html.value))
  }).done();
}


function parseJSON(json) {
  var week = {};
  week.department = json[0].children[3].children[1].children[0].children[0].content;
  week.startDate = json[0].children[4].children[1].children[0].children[0].content;

  var table = json[1].children[1];

  // Index is set here to have leave it unchanged by the loop
  // Index wird hier definiert, um die Variable nicht durch die Schleife zu verändern
  var index = 1;
  week.weekdays = [];
  for (let d = 0; d <= 5; d++) {
    week.weekdays.push({
      hours: 0,
      content: "",
    })

    for (let i = index; i < table.children.length - 2; i++) {
      index++;
      var row = table.children[i];

      if (row.children.length > 3) break;
      if (row.children[0].children.length > 0 && row.children[0].children[0].children.length > 0) {
        week.weekdays[d].content += "\n" + row.children[0].children[0].children[0].content.trim();
      }
      if (row.children[2].children.length > 0 && row.children[2].children[0].children.length > 0)
        week.weekdays[d].hours = +row.children[2].children[0].children[0].content.replace(",", ".");
    }
  }
  weeks.push(week);
  if (weeks.length === length)
    saveJSON({ settings: settings, weeks: weeks });
}

// Writes the file to the targetpath and gives a notification wether it worked
// Schreibt die Datei in das Zielverzeichnis und gibt eine Nachricht aus, ob der Vorgang funktioniert hat
function saveJSON(data) {
  fs.writeFile(saveFileName, JSON.stringify(data, null, 4), function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("JSON saved to " + saveFileName);
    }
  });
}