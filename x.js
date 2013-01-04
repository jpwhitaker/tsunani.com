var fs = require('fs');
var http = require('http');
var _ = require('underscore');
var express = require('express');
var convert =  require('libxmljs').parseXml;

var template = fs.readFileSync('template.template').toString();

console.log('starting up')


function scrapeData() {
  http.get('http://www.prh.noaa.gov/hnl/xml/Surf.xml', function (res){
    var xml = '';
    res.on('data', function (d) { xml += d})
      .on('end', function () {
        parseData(xml);
      });
  });
}

function parseData(xml) {

  //takes the XML file and returns the surf forecast (19th child node)
  var rawData = convert(xml).get('channel').childNodes()[19].text();
  console.log('rawData' + " " + rawData)

  var splitLines = rawData.split(/\n/)
  var northWestEastSouth = splitLines.slice(3,7);
  console.log(northSouth)

  


  //extracts the heights in pairs (x to x, x to x, etc.)
  var parsedSurfData = rawData.match(/\d{1,2}( to )\d{1,2}/g).join(', ');
  console.log('parsedSurfData' + " " + parsedSurfData)

  var parsedSurfDataArray = parsedSurfData.split(",")
  var surfHeightArray = _.map(parsedSurfDataArray, function(num){ return num.match(/\d{1,2}/g)})
  console.log(surfHeightArray);



  var html = _.template(template, {data: parsedSurfData});
  console.log(parsedSurfData);
  fs.writeFileSync(__dirname + '/index.html', html);
}


scrapeData();
express()
  .get('/*', function (req, res ) { res.sendfile(__dirname + req.url)})
  .listen(8080);


