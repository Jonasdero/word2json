const fs = require('fs');
const path = require('path');

const mammoth = require("mammoth");
const himalaya = require("himalaya");

//Information where to save the document after it is created
var saveFileName = 'result.json';
var dir = './inputJSON';

//Sets the required metadata for the documenthead
var settings = {
  vorname: "Jonas",
  nachname: "Roser",
  ausbildungsStart: "07.09.2016",
  beruf: "Fachinformatiker Anwendungsentwicklung",
  spe: "Siemens Professional Education Paderborn",
  atiw: "Atiw Paderborn",
  praxis: "Atos, AIS GER HR PD Azubi"
};

var weeks = [];
var length = -1;

//Checks if target directory exists and creates it if doesn't
if (fs.existsSync(path.join(__dirname, saveFileName)))
  fs.unlinkSync(path.join(__dirname, saveFileName));

if (!fs.existsSync(path.join(__dirname, dir)))
  fs.mkdirSync(path.join(__dirname, dir));

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
  var days = ['Mo', 'Di', 'Mi', 'Do', 'Fr'];

  //index is set here to have leave it unchanged by the loop
  var index = 1;

  for (let day of days) {
    week['content' + day] = "";
    week['h' + day] = "";
    for (let i = index; i < table.children.length - 2; i++) {
      index++;
      var row = table.children[i];

      if (row.children.length > 3) break;
      if (row.children[0].children.length > 0 && row.children[0].children[0].children.length > 0) {
        week['content' + day] += "\n" + row.children[0].children[0].children[0].content.trim();
      }
      if (row.children[2].children.length > 0 && row.children[2].children[0].children.length > 0)
        week['h' + day] = +row.children[2].children[0].children[0].content.replace(",", ".");
    }
  }
  weeks.push(week);
  if (weeks.length === length)
    saveJSON({ settings: settings, weeks: weeks });
}

//writes the file to the targetpath and gives a notification wether it worked
function saveJSON(data) {
  fs.writeFile(saveFileName, JSON.stringify(data, null, 4), function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("JSON saved to " + saveFileName);
    }
  });
}
